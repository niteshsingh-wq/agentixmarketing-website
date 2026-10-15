#!/usr/bin/env node
/**
 * Build-time migration gate.
 *
 * `payload migrate` writes to whatever database DATABASE_URL_UNPOOLED points
 * at. In Vercel the Neon variables are scoped to BOTH Preview and Production,
 * so an unguarded migrate step lets any preview build alter the production
 * schema before the code is reviewed or promoted.
 *
 *   Production (VERCEL_ENV=production)  -> always migrate
 *   Preview    (VERCEL_ENV=preview)     -> migrate only when the preview has
 *                                         its own database, declared by
 *                                         PREVIEW_DATABASE_ISOLATED=true
 *   Anywhere else (local, CI)           -> migrate only with
 *                                         ALLOW_LOCAL_MIGRATE=true
 *
 * Skipping is not an error: the build continues and the app runs against the
 * existing schema.
 *
 * Before migrating, a read-only preflight compares the database's migration
 * history with src/migrations and fails the build with a clear message when
 * `payload migrate` would otherwise prompt (and hang a non-interactive build)
 * or apply migrations in an unsafe order.
 */
import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const MIGRATIONS_DIR = path.resolve('src/migrations')

// Rows in payload_migrations that intentionally have no file in the repo.
//
// 20260605_214452: generated and applied by the first Vercel build, whose
// build command ran `payload migrate:create` on the build machine, so the file
// was never committed. 20260605_222603 is the committed, idempotent baseline of
// that same initial schema, so a fresh database is reproduced without it.
const KNOWN_UNTRACKED = new Set(['20260605_214452'])

// Upper bound on `payload migrate`. Anything that waits for input (a prompt)
// fails the build instead of holding it until the platform build timeout.
const MIGRATE_TIMEOUT_MS = 10 * 60 * 1000

const env = process.env.VERCEL_ENV

function decide() {
  if (env === 'production') return { run: true, why: 'production deployment' }
  if (env === 'preview') {
    return process.env.PREVIEW_DATABASE_ISOLATED === 'true'
      ? { run: true, why: 'preview with an isolated database (PREVIEW_DATABASE_ISOLATED=true)' }
      : { run: false, why: 'preview deployment shares the production database — set PREVIEW_DATABASE_ISOLATED=true only once Preview has its own database' }
  }
  return process.env.ALLOW_LOCAL_MIGRATE === 'true'
    ? { run: true, why: 'ALLOW_LOCAL_MIGRATE=true' }
    : { run: false, why: 'not a Vercel production build — set ALLOW_LOCAL_MIGRATE=true to migrate the database in DATABASE_URL_UNPOOLED' }
}

function fail(msg) {
  console.error(`[migrate] PREFLIGHT FAILED: ${msg}`)
  process.exit(1)
}

/** Migration names exactly as `payload migrate` derives them from the directory. */
function repoMigrations() {
  return readdirSync(MIGRATIONS_DIR)
    .filter(f => (f.endsWith('.ts') || f.endsWith('.js')) && f !== 'index.ts' && f !== 'index.js')
    .map(f => f.split('.')[0])
    .sort()
}

/** Names registered in src/migrations/index.ts (kept in sync by migrate:create). */
function registeredMigrations() {
  const src = readFileSync(path.join(MIGRATIONS_DIR, 'index.ts'), 'utf8')
  return [...src.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1]).sort()
}

async function preflight() {
  const files = repoMigrations()
  const registered = registeredMigrations()
  const unregistered = files.filter(n => !registered.includes(n))
  const orphaned = registered.filter(n => !files.includes(n))
  if (unregistered.length || orphaned.length) {
    fail(
      'src/migrations/index.ts is out of sync with the migration files' +
      (unregistered.length ? ` — not registered: ${unregistered.join(', ')}` : '') +
      (orphaned.length ? ` — registered without a file: ${orphaned.join(', ')}` : '')
    )
  }

  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  if (!connectionString) fail('no DATABASE_URL_UNPOOLED or DATABASE_URL is set')

  // Use the same driver the Payload adapter uses, without a separate dependency.
  const require = createRequire(import.meta.url)
  const pg = createRequire(require.resolve('@payloadcms/db-postgres'))('pg')
  const client = new pg.Client({
    connectionString,
    connectionTimeoutMillis: 15_000,
    statement_timeout: 15_000,
  })

  let rows = []
  try {
    await client.connect()
    await client.query('BEGIN READ ONLY')
    const { rows: [t] } = await client.query(`SELECT to_regclass('public.payload_migrations') IS NOT NULL AS present`)
    if (t.present) {
      ;({ rows } = await client.query('SELECT name, batch FROM payload_migrations ORDER BY id'))
    }
    await client.query('ROLLBACK')
  } catch (err) {
    fail(`could not read migration history: ${err.message}`)
  } finally {
    await client.end().catch(() => {})
  }

  const devRows = rows.filter(r => Number(r.batch) === -1)
  if (devRows.length) {
    fail(
      'payload_migrations contains a dev-mode marker (batch -1): the schema was pushed ' +
      'directly by a dev server. `payload migrate` would stop at an interactive data-loss ' +
      'prompt. Compare the schema with the committed migrations before removing the marker.'
    )
  }

  const applied = rows.map(r => r.name)
  const unknown = applied.filter(n => !files.includes(n) && !KNOWN_UNTRACKED.has(n))
  if (unknown.length) {
    fail(
      `the database has applied migrations that are not in this commit: ${unknown.join(', ')}. ` +
      'Another branch or deployment changed the schema; add the missing migration file(s) ' +
      '(or, once reviewed, list the name in KNOWN_UNTRACKED) before deploying.'
    )
  }

  const latestApplied = applied.filter(n => files.includes(n)).sort().at(-1)
  const pending = files.filter(n => !applied.includes(n))
  const outOfOrder = latestApplied ? pending.filter(n => n < latestApplied) : []
  if (outOfOrder.length) {
    fail(
      `pending migration(s) ${outOfOrder.join(', ')} are older than the latest applied ` +
      `migration ${latestApplied}. Review them before they run against this database.`
    )
  }

  const untracked = applied.filter(n => KNOWN_UNTRACKED.has(n))
  console.log(
    `[migrate] preflight OK: ${applied.length} applied` +
    (untracked.length ? ` (known untracked: ${untracked.join(', ')})` : '') +
    `, ${pending.length} pending${pending.length ? `: ${pending.join(', ')}` : ''}`
  )
}

const { run, why } = decide()

if (!run) {
  console.warn(`[migrate] SKIPPED: ${why}`)
  process.exit(0)
}

await preflight()

console.log(`[migrate] running payload migrate: ${why}`)
const result = spawnSync('pnpm', ['payload', 'migrate'], {
  // No stdin: a prompt can never be answered by the build.
  stdio: ['ignore', 'inherit', 'inherit'],
  env: process.env,
  timeout: MIGRATE_TIMEOUT_MS,
  killSignal: 'SIGKILL',
})
if (result.error) {
  console.error(`[migrate] payload migrate did not finish: ${result.error.message}`)
  process.exit(1)
}
process.exit(result.status ?? 1)

import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Distributed fixed-window rate limiter backed by the existing Neon Postgres
 * database.
 *
 * Vercel runs these routes across many short-lived instances, so an in-memory
 * counter would reset constantly and be trivially bypassed by spreading
 * requests. Postgres is already a hard dependency of this app (Payload uses
 * it), so reusing its connection pool keeps the infrastructure unchanged — no
 * Redis, no new service, no new env vars.
 *
 * The counter is incremented with a single atomic INSERT .. ON CONFLICT so
 * concurrent requests cannot race past the limit.
 */

export interface RateLimitResult {
  ok: boolean
  /** Requests already counted inside the current window. */
  count: number
  limit: number
  /** Seconds until the current window expires. */
  retryAfter: number
}

/**
 * Best-effort client IP. Vercel always sets x-forwarded-for; the left-most
 * entry is the real client. Falls back to a constant so a missing header
 * degrades to a shared bucket rather than no limit at all.
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first.slice(0, 64)
  }
  return req.headers.get('x-real-ip')?.slice(0, 64) || 'unknown'
}

/**
 * Rows are only ever needed for the longest window in use (1 day). Anything
 * older than this is dead weight and is deleted opportunistically.
 */
const STALE_AFTER = '2 days'
/** Roughly 1 in CLEANUP_ODDS limiter calls also prunes stale rows. */
const CLEANUP_ODDS = 50

function bucketKey(bucket: string, identifier: string): string {
  return `${bucket}:${identifier}`.slice(0, 255)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPool(): Promise<any> {
  const payload = await getPayload({ config })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (payload.db as any).pool
}

/**
 * Rejected (429) attempts are counted on purpose. The window start never
 * moves while a window is open, so extra counts cannot extend a lockout; they
 * only record how hard the endpoint is being hit.
 */
export async function rateLimit(
  bucket: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const key = bucketKey(bucket, identifier)

  try {
    const pool = await getPool()

    if (!pool?.query) {
      // No pool available (unexpected) — fail open rather than lose a lead.
      console.error('[rate-limit] database pool unavailable, allowing request')
      return { ok: true, count: 0, limit, retryAfter: 0 }
    }

    const { rows } = await pool.query(
      `INSERT INTO rate_limits AS rl (key, count, window_start)
       VALUES ($1, 1, now())
       ON CONFLICT (key) DO UPDATE SET
         count = CASE
           WHEN rl.window_start < now() - make_interval(secs => $2::float8) THEN 1
           ELSE rl.count + 1
         END,
         window_start = CASE
           WHEN rl.window_start < now() - make_interval(secs => $2::float8) THEN now()
           ELSE rl.window_start
         END
       RETURNING count,
                 GREATEST(0, CEIL(EXTRACT(EPOCH FROM (window_start + make_interval(secs => $2::float8)) - now())))::int AS retry_after`,
      [key, windowSeconds]
    )

    const count: number = Number(rows[0]?.count ?? 1)
    const retryAfter: number = Number(rows[0]?.retry_after ?? windowSeconds)

    // Expired rows are never read again. Prune them occasionally rather than
    // on every request; the window_start index keeps this cheap. Awaited so a
    // serverless freeze cannot drop it, and isolated so it can never block.
    if (Math.random() * CLEANUP_ODDS < 1) {
      try {
        await pool.query(`DELETE FROM rate_limits WHERE window_start < now() - interval '${STALE_AFTER}'`)
      } catch (err) {
        console.error('[rate-limit] cleanup failed:', err)
      }
    }

    return { ok: count <= limit, count, limit, retryAfter }
  } catch (err) {
    // Fail OPEN. A database hiccup must not block genuine enquiries on a lead
    // generation site — the honeypot and validation layers still apply.
    console.error('[rate-limit] check failed, allowing request:', err)
    return { ok: true, count: 0, limit, retryAfter: 0 }
  }
}

/**
 * Give back one counted attempt. Used when a request passed the limiter but
 * then failed on OUR side (database or mail down), so a visitor who retries
 * is not locked out by our own outage. Never throws.
 */
export async function refundRateLimit(bucket: string, identifier: string): Promise<void> {
  try {
    const pool = await getPool()
    if (!pool?.query) return
    await pool.query(
      `UPDATE rate_limits SET count = GREATEST(count - 1, 0) WHERE key = $1`,
      [bucketKey(bucket, identifier)]
    )
  } catch (err) {
    console.error('[rate-limit] refund failed:', err)
  }
}

/** Standard 429 response with a Retry-After header. */
export function tooManyRequests(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again shortly.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.max(1, result.retryAfter)),
      },
    }
  )
}

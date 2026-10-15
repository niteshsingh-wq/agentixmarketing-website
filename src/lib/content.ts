import { getPayload } from 'payload'
import config from '@payload-config'
import { getAllServiceSlugs } from '@/data/services'
import { CASE_STUDIES } from '@/data/case-studies'

/**
 * Single source of truth for "which public URLs exist, and when did they last
 * change".
 *
 * The public pages resolve content Payload-first with a static fallback
 * (see services/[slug] and case-studies/[slug]). That means a URL is live if
 * it exists in EITHER source, so the sitemap must reflect the union — using
 * only Payload would drop pages that still render from static data, and using
 * only static data (the previous behaviour) drops anything added in the CMS.
 */

/**
 * Fallback timestamp for entries that only exist in the static data files.
 * Set to the last commit touching src/data/*.ts — bump it when that content
 * is meaningfully edited. Deliberately NOT `new Date()`: emitting "now" for
 * every URL on every build is a well-known way to get lastmod ignored.
 */
export const STATIC_CONTENT_UPDATED = new Date('2026-06-05T01:37:53.000Z')

/**
 * Where public service and case-study content comes from.
 *
 *   hybrid (default) — Payload first, static data for any slug Payload lacks.
 *                      Safe while the CMS may be incomplete, but a record that
 *                      is deleted or renamed in Payload is "resurrected" from
 *                      static data at its old URL.
 *   payload          — CONTENT_SOURCE=payload. Payload is authoritative: a slug
 *                      that is not in Payload 404s and leaves the sitemap.
 *
 * Only switch to `payload` once production Payload holds every static slug
 * that should stay live, otherwise those URLs start returning 404.
 */
export function staticFallbackEnabled(): boolean {
  return process.env.CONTENT_SOURCE !== 'payload'
}

/**
 * Handle a Payload read that THREW (database or Payload unavailable), as
 * opposed to one that simply found nothing.
 *
 * At runtime this rethrows. A failed ISR regeneration is discarded and the
 * last good page keeps being served, whereas returning static fallback
 * content (or a 404 for a CMS-only slug) would be cached for the full
 * revalidate window.
 *
 * During `next build` in hybrid mode it logs and returns, so pages can still
 * prerender from static data. In payload mode it always rethrows: there is no
 * fallback to build from.
 */
export function handlePayloadReadError(scope: string, e: unknown): void {
  const building = process.env.NEXT_PHASE === 'phase-production-build'
  if (building && staticFallbackEnabled()) {
    console.error(`[content] ${scope}: Payload unavailable during build, using static data:`, e)
    return
  }
  console.error(`[content] ${scope}: Payload unavailable, keeping the last cached version:`, e)
  throw e
}

export interface ContentEntry {
  slug: string
  lastModified: Date
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isUsableSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.length > 0 && slug.length <= 120 && SLUG_RE.test(slug)
}

function toDate(value: unknown, fallback: Date): Date {
  if (typeof value === 'string' || value instanceof Date) {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) return d
  }
  return fallback
}

/**
 * Read slug + updatedAt for a collection. A Payload failure is handled by
 * handlePayloadReadError: static set during a hybrid build, otherwise a throw
 * so the previously cached sitemap is kept.
 */
async function payloadEntries(
  collection: 'services' | 'case-studies'
): Promise<Map<string, Date>> {
  const out = new Map<string, Date>()
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection,
      limit: 500,
      pagination: false,
      depth: 0,
    })
    for (const doc of docs as unknown as Array<Record<string, unknown>>) {
      if (!isUsableSlug(doc.slug)) continue
      out.set(doc.slug, toDate(doc.updatedAt ?? doc.createdAt, STATIC_CONTENT_UPDATED))
    }
  } catch (e) {
    handlePayloadReadError(`sitemap ${collection}`, e)
  }
  return out
}

/**
 * Merge static slugs with Payload docs (static slugs only in hybrid mode).
 * Payload wins on lastModified because the page renders the Payload version
 * when it exists.
 */
function merge(staticSlugs: string[], fromPayload: Map<string, Date>): ContentEntry[] {
  const merged = new Map<string, Date>()
  if (staticFallbackEnabled()) {
    for (const slug of staticSlugs) {
      if (isUsableSlug(slug)) merged.set(slug, STATIC_CONTENT_UPDATED)
    }
  }
  for (const [slug, lastModified] of fromPayload) {
    merged.set(slug, lastModified)
  }
  return [...merged.entries()]
    .map(([slug, lastModified]) => ({ slug, lastModified }))
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

export async function getServiceEntries(): Promise<ContentEntry[]> {
  return merge(getAllServiceSlugs(), await payloadEntries('services'))
}

export async function getCaseStudyEntries(): Promise<ContentEntry[]> {
  return merge(
    CASE_STUDIES.map(cs => cs.slug),
    await payloadEntries('case-studies')
  )
}

/**
 * Most recent lastModified across a set of entries — used to give listing
 * pages (e.g. /case-studies) a truthful timestamp instead of a hardcoded one.
 */
export function newestDate(entries: ContentEntry[], fallback: Date): Date {
  return entries.reduce<Date>(
    (acc, e) => (e.lastModified > acc ? e.lastModified : acc),
    fallback
  )
}

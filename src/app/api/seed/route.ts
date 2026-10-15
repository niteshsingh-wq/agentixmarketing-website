import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CASE_STUDIES } from '@/data/case-studies'
import { AGENTIX_CONTENT } from '@/data/content'
import { SERVICES } from '@/data/services'

// Mutates the database — never prerender or cache.
export const dynamic = 'force-dynamic'

const SECRET_HEADER = 'x-seed-secret'

/** Constant-time comparison that does not leak length via early return. */
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  if (a.length !== b.length) {
    // Still burn a comparison so the failure path has similar timing.
    timingSafeEqual(a, a)
    return false
  }
  return timingSafeEqual(a, b)
}

/**
 * Seeding is a POST with the secret in a header.
 *
 * It used to be a GET with `?secret=...`, which writes the credential into
 * Vercel access logs, browser history and any outbound Referer header.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.SEED_SECRET
  if (!expected) {
    console.error('[seed] SEED_SECRET is not set — refusing to seed')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const provided = req.headers.get(SECRET_HEADER)
  if (!provided || !secretMatches(provided, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const results: { caseStudies: any[]; testimonials: any[]; services: any[] } = {
    caseStudies: [],
    testimonials: [],
    services: [],
  }

  // Seed case studies
  for (const cs of CASE_STUDIES) {
    try {
      const existing = await payload.find({ collection: 'case-studies', where: { slug: { equals: cs.slug } }, limit: 1 })
      if (existing.totalDocs > 0) {
        results.caseStudies.push({ slug: cs.slug, status: 'skipped (already exists)' })
        continue
      }
      await payload.create({
        collection: 'case-studies',
        data: {
          slug: cs.slug,
          client: cs.client,
          industry: cs.industry,
          result: cs.result,
          desc: cs.desc,
          lead: cs.lead,
          challenge: cs.challenge,
          tags: cs.tags.map(value => ({ value })),
          cats: cs.cats.map(value => ({ value })),
          approach: cs.approach.map(([title, body]) => ({ title, body })),
          metrics: cs.metrics.map(m => ({ n: m.n, l: m.l })),
          quote: { text: cs.quote.text, author: cs.quote.author, role: cs.quote.role },
        },
      })
      results.caseStudies.push({ slug: cs.slug, status: 'created' })
    } catch (err) {
      results.caseStudies.push({ slug: cs.slug, status: 'error', error: String(err) })
    }
  }

  // Seed testimonials
  for (const tm of AGENTIX_CONTENT.testimonials) {
    try {
      const existing = await payload.find({ collection: 'testimonials', where: { author: { equals: tm.author } }, limit: 1 })
      if (existing.totalDocs > 0) {
        results.testimonials.push({ author: tm.author, status: 'skipped (already exists)' })
        continue
      }
      await payload.create({
        collection: 'testimonials',
        data: {
          quote: tm.quote,
          author: tm.author,
          role: tm.role,
          company: tm.company,
          rating: String(tm.rating) as never,
          result: tm.result,
        },
      })
      results.testimonials.push({ author: tm.author, status: 'created' })
    } catch (err) {
      results.testimonials.push({ author: tm.author, status: 'error', error: String(err) })
    }
  }

  // Seed services
  for (const svc of Object.values(SERVICES)) {
    try {
      const existing = await payload.find({ collection: 'services', where: { slug: { equals: svc.slug } }, limit: 1 })
      if (existing.totalDocs > 0) {
        results.services.push({ slug: svc.slug, status: 'skipped (already exists)' })
        continue
      }
      await payload.create({
        collection: 'services',
        data: {
          slug: svc.slug,
          title: svc.title,
          category: svc.category,
          tag: svc.tag,
          metaTitle: svc.metaTitle,
          metaDescription: svc.metaDescription,
          focusKeyword: svc.focusKeyword,
          lead: svc.lead,
          stats: svc.stats.map(s => ({ n: s.n, l: s.l })),
          deliverables: svc.deliverables.map(([title, body]) => ({ title, body })),
          process: svc.process.map(([step, desc]) => ({ step, desc })),
          faqs: svc.faqs.map(([q, a]) => ({ q, a })),
        },
      })
      results.services.push({ slug: svc.slug, status: 'created' })
    } catch (err) {
      results.services.push({ slug: svc.slug, status: 'error', error: String(err) })
    }
  }

  return NextResponse.json(results)
}

/**
 * The old `GET /api/seed?secret=...` form is permanently disabled so the
 * secret can never travel in a URL again.
 */
export async function GET() {
  return NextResponse.json(
    { error: `Method not allowed. Use POST with the ${SECRET_HEADER} header.` },
    { status: 405, headers: { Allow: 'POST' } }
  )
}

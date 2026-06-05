import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CASE_STUDIES } from '@/data/case-studies'
import { AGENTIX_CONTENT } from '@/data/content'
import { SERVICES } from '@/data/services'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized — set SEED_SECRET env var and pass ?secret=...' }, { status: 401 })
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
          rating: String(tm.rating),
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

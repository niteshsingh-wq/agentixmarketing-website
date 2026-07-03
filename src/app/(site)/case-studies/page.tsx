import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMeta } from '@/lib/metadata'
import { PageHero } from '@/components/ui/PageHero'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Marquee } from '@/components/layout/Marquee'
import { CtaSection } from '@/components/ui/CtaSection'
import { FilterableGrid } from '@/components/case-studies/FilterBar'
import { CASE_STUDIES, type CaseStudy } from '@/data/case-studies'
import { AGENTIX } from '@/data/site'
import { Arrow } from '@/components/ui/Arrow'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

function payloadToCaseStudy(doc: any): CaseStudy {
  return {
    slug: doc.slug,
    client: doc.client,
    industry: doc.industry || '',
    result: doc.result || '',
    desc: doc.desc || '',
    lead: doc.lead || '',
    challenge: doc.challenge || '',
    tags: (doc.tags || []).map((t: any) => t.value || t),
    cats: (doc.cats || []).map((c: any) => c.value || c),
    approach: (doc.approach || []).map((a: any) => [a.title || '', a.body || ''] as [string, string]),
    metrics: (doc.metrics || []).map((m: any) => ({ n: m.n || '', l: m.l || '' })),
    quote: { text: doc.quote?.text || '', author: doc.quote?.author || '', role: doc.quote?.role || '' },
  }
}

async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'case-studies', limit: 100, sort: '-createdAt' })
    if (docs.length > 0) return docs.map(payloadToCaseStudy)
  } catch (e) {
    console.error('[case-studies] Payload fetch failed, using static data:', e)
  }
  return CASE_STUDIES
}

export const metadata: Metadata = buildMeta({
  title: 'Case Studies — Agentix Shopify & SEO Results',
  description: 'Real client results across Shopify development and SEO. See how we\'ve driven +312% organic revenue, 300% faster order processing and more for ecommerce brands.',
  canonical: 'https://agentixmarketing.com/case-studies',
})

const HERO_STATS = [
  { n: '+285%', l: 'Avg. organic traffic' },
  { n: '200+', l: 'Stores shipped' },
  { n: '$50M+', l: 'Client revenue driven' },
]

export default async function CaseStudiesPage() {
  const cases = await getCaseStudies()

  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Results we're proud to put our name on."
        sub="Real clients, real numbers, real growth — across Shopify development and SEO."
        stats={HERO_STATS}
      />

      <section className="theme-dark" style={{ padding: '20px 0 36px', borderBlock: '1px solid var(--ink-line)' }}>
        <Marquee />
      </section>

      <section className="section theme-light" style={{ paddingTop: 'clamp(40px, 6vw, 90px)' }}>
        <div className="wrap">
          <FilterableGrid cases={cases} />
        </div>
      </section>

      <section className="section theme-dark">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">The receipts</span>
            <h2 className="h2" style={{ marginTop: 18 }}>The numbers behind the work.</h2>
          </RevealWrapper>
          <div className="success-stats">
            {AGENTIX.proof.map((p, i) => (
              <RevealWrapper key={i} className="success-cell">
                <div className="sn">{p.n}</div>
                <div className="sl">{p.label}</div>
                <div className="sc">{p.code}</div>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="section theme-dark" style={{ paddingTop: 0, paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
        <div className="wrap">
          <RevealWrapper>
            <span className="eyebrow">Explore further</span>
            <div className="link-row" style={{ marginTop: 20 }}>
              <Link href="/results">Results by discipline <Arrow s={14} /></Link>
              <Link href="/services/custom-shopify-store-development">Shopify development <Arrow s={14} /></Link>
              <Link href="/services/ecommerce-seo-online-stores">Ecommerce SEO <Arrow s={14} /></Link>
              <Link href="/services/conversion-rate-optimization">Conversion rate optimisation <Arrow s={14} /></Link>
              <Link href="/contact">Work with us <Arrow s={14} /></Link>
            </div>
          </RevealWrapper>
        </div>
      </section>

      <CtaSection
        eyebrow="Your turn"
        heading="Ready to be the next case study?"
        sub="Book a free 30-minute strategy session. We'll audit your store live and show you exactly where the growth is."
        btn="Book a strategy call"
      />
    </>
  )
}

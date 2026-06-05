import type { Metadata } from 'next'
import { buildMeta } from '@/lib/metadata'
import { PageHero } from '@/components/ui/PageHero'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Marquee } from '@/components/layout/Marquee'
import { CtaSection } from '@/components/ui/CtaSection'
import { FilterableGrid } from '@/components/case-studies/FilterBar'
import { CASE_STUDIES } from '@/data/case-studies'
import { AGENTIX } from '@/data/site'

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

export default function CaseStudiesPage() {
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
          <FilterableGrid cases={CASE_STUDIES} />
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

      <CtaSection
        eyebrow="Your turn"
        heading="Ready to be the next case study?"
        sub="Book a free 30-minute strategy session. We'll audit your store live and show you exactly where the growth is."
        btn="Book a strategy call"
      />
    </>
  )
}

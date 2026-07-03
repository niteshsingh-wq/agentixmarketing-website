import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMeta } from '@/lib/metadata'
import { PageHero } from '@/components/ui/PageHero'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Marquee } from '@/components/layout/Marquee'
import { CtaSection } from '@/components/ui/CtaSection'
import { ResultsTabs } from '@/components/results/ResultsTabs'
import { Arrow } from '@/components/ui/Arrow'
import { linkify } from '@/lib/linkify'

export const metadata: Metadata = buildMeta({
  title: 'Results & Proof — Agentix Shopify & SEO Agency',
  description: "Every metric is from a real client engagement. +285% avg organic traffic, +145% mobile CVR, 200+ Shopify stores shipped. We don't round up.",
  canonical: 'https://agentixmarketing.com/results',
})

const METHODOLOGY: [string, string][] = [
  ['We measure what matters', 'Revenue and qualified leads, not vanity traffic. Every report ladders back to the metrics that actually move your business.'],
  ['Senior-led, always', 'No juniors on client accounts. Every engagement is run by a specialist with deep ecommerce experience — start to finish.'],
  ['Transparent reporting', "Clear monthly reports you'll actually read — what we did, what it moved, and what's next. No dashboards you'll never open."],
]

const RES_TESTIMONIALS = [
  { author: 'Marcus T.', role: 'COO', company: 'SkinLogic', result: '+312% revenue', quote: 'Agentix rebuilt our store and our search presence simultaneously. The organic revenue growth was measurable within 90 days.' },
  { author: 'Sarah K.', role: 'Founder', company: 'Chai Monkey', result: '+420% traffic', quote: 'We went from invisible to ranking top 3 for our most important terms. The team genuinely understands ecommerce SEO.' },
  { author: 'Dan R.', role: 'Director', company: 'Retrofitters', result: '15 hrs/wk saved', quote: 'The B2B ordering system they built saved us 15 hours a week in manual processing. It paid for itself in month two.' },
]

const HERO_STATS = [
  { n: '3.2x', l: 'Avg. revenue lift' }, { n: '+285%', l: 'Avg. organic traffic' },
  { n: '200+', l: 'Stores shipped' }, { n: '$50M+', l: 'Revenue driven' },
]

function Stars() {
  return (
    <div className="tm-stars" aria-label="5 out of 5">
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.9l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  )
}

export default function ResultsPage() {
  return (
    <>
      <PageHero
        eyebrow="Results & proof"
        title="Numbers that speak for themselves."
        sub="Every metric below is from a real client engagement. We don't round up. We don't cherry-pick."
        stats={HERO_STATS}
      />

      <section className="theme-dark" style={{ padding: '20px 0 36px', borderBlock: '1px solid var(--ink-line)' }}>
        <Marquee />
      </section>

      <section className="section theme-dark">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">By the numbers</span>
            <h2 className="h2" style={{ marginTop: 18 }}>Results by discipline.</h2>
          </RevealWrapper>
          <ResultsTabs />
        </div>
      </section>

      <section className="section theme-light">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">How we work</span>
            <h2 className="h2" style={{ marginTop: 18 }}>Why our numbers hold up.</h2>
          </RevealWrapper>
          <div className="method-grid">
            {METHODOLOGY.map(([t, d], i) => (
              <RevealWrapper key={t} className={'method-col' + (i === 0 ? ' lit' : '')}>
                <h3>{t}</h3>
                <p>{linkify(d, '/results')}</p>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="section theme-dark">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">Testimonials</span>
            <h2 className="h2" style={{ marginTop: 18 }}>In their words.</h2>
          </RevealWrapper>
          <div className="tm-grid">
            {RES_TESTIMONIALS.map((t, i) => (
              <RevealWrapper key={i}>
                <figure className="tm-card">
                  <div className="tm-card-top"><Stars /><span className="tm-result">{t.result}</span></div>
                  <blockquote className="tm-quote">{linkify(t.quote, '/results')}</blockquote>
                  <figcaption className="tm-author">
                    <div className="tm-avatar">{t.author[0]}</div>
                    <div className="tm-meta"><b>{t.author}</b><span>{t.role} · {t.company}</span></div>
                  </figcaption>
                </figure>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="section theme-dark" style={{ paddingTop: 0, paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
        <div className="wrap">
          <RevealWrapper>
            <span className="eyebrow">Explore the work</span>
            <div className="link-row" style={{ marginTop: 20 }}>
              <Link href="/case-studies">Client case studies <Arrow s={14} /></Link>
              <Link href="/services/ecommerce-seo-online-stores">Ecommerce SEO <Arrow s={14} /></Link>
              <Link href="/services/conversion-rate-optimization">Conversion rate optimisation <Arrow s={14} /></Link>
              <Link href="/services/custom-shopify-store-development">Shopify development <Arrow s={14} /></Link>
              <Link href="/contact">Book a free audit <Arrow s={14} /></Link>
            </div>
          </RevealWrapper>
        </div>
      </section>

      <CtaSection
        eyebrow="Your store"
        heading="See what we'd do for your store."
        sub="Book a free 30-minute strategy session. We'll audit your store live and leave you with three things to fix — whether you work with us or not."
        btn="Book a strategy call"
      />
    </>
  )
}

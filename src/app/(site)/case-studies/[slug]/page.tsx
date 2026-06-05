import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMeta } from '@/lib/metadata'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Marquee } from '@/components/layout/Marquee'
import { CtaSection } from '@/components/ui/CtaSection'
import { CaseStudyCard } from '@/components/case-studies/CaseStudyCard'
import { CaseStudyHeroCtas } from '@/components/case-studies/CaseStudyHeroCtas'
import { getCaseStudy, getAllCaseStudySlugs, CASE_STUDIES } from '@/data/case-studies'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return getAllCaseStudySlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return {}
  return buildMeta({
    title: `${cs.client} Case Study — ${cs.result} | Agentix`,
    description: `${cs.client} — ${cs.result}. ${cs.lead}`,
    canonical: `https://agentixmarketing.com/case-studies/${slug}`,
  })
}

export default async function CaseStudyPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  const related = CASE_STUDIES.filter(c => c.slug !== slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${cs.client} — ${cs.result}`,
    description: cs.lead,
    author: { '@type': 'Organization', name: 'Agentix', url: 'https://agentixmarketing.com' },
    publisher: { '@type': 'Organization', name: 'Agentix', url: 'https://agentixmarketing.com' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="svc-hero theme-dark" id="top">
        <div className="hero-glow"></div>
        <div className="wrap">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/case-studies">Case Studies</Link><span className="sep">/</span>
            <span className="here">{cs.client}</span>
          </nav>
          <div className="svc-hero-grid">
            <div>
              <span className="eyebrow">{cs.industry}</span>
              <h1 className="svc-title" style={{ marginTop: 18 }}>{cs.client}</h1>
              <p className="svc-lead">{cs.lead}</p>
              <div className="cs-tags" style={{ marginTop: 24 }}>
                {cs.tags.map(t => (
                  <span key={t} className="tag" style={{ fontSize: 12, color: 'var(--blue)', border: '1px solid var(--ink-line)', padding: '5px 12px', borderRadius: 100 }}>{t}</span>
                ))}
              </div>
              <CaseStudyHeroCtas />
            </div>
            <RevealWrapper className="svc-statcard">
              {cs.metrics.map((m, i) => (
                <div className="ss" key={i}>
                  <span className="n">{m.n}</span>
                  <span className="l">{m.l}</span>
                </div>
              ))}
            </RevealWrapper>
          </div>
        </div>
      </section>

      <section className="theme-dark" style={{ padding: '20px 0 36px', borderBlock: '1px solid var(--ink-line)' }}>
        <Marquee />
      </section>

      {/* CHALLENGE */}
      <section className="section theme-light">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 760 }}>
            <span className="eyebrow">The challenge</span>
            <h2 className="h2" style={{ marginTop: 18 }}>{cs.result}</h2>
            <p className="csd-body">{cs.challenge}</p>
          </RevealWrapper>
        </div>
      </section>

      {/* APPROACH */}
      <section className="section theme-dark">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">What we did</span>
            <h2 className="h2" style={{ marginTop: 18 }}>The approach.</h2>
          </RevealWrapper>
          <div className="inc-grid">
            {cs.approach.map(([t, d], i) => (
              <RevealWrapper key={i} className="inc-card">
                <div className="inc-num">{String(i + 1).padStart(2, '0')}</div>
                <h4>{t}</h4>
                <p>{d}</p>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="section theme-light">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">The results</span>
            <h2 className="h2" style={{ marginTop: 18 }}>What changed.</h2>
          </RevealWrapper>
          <div className="success-stats">
            {cs.metrics.map((m, i) => (
              <RevealWrapper key={i} className="success-cell">
                <div className="sn">{m.n}</div>
                <div className="sl">{m.l}</div>
                <div className="sc">/{String(i + 1).padStart(3, '0')}</div>
              </RevealWrapper>
            ))}
          </div>
          {cs.quote && (
            <RevealWrapper className="cs-quote">
              <blockquote>&ldquo;{cs.quote.text}&rdquo;</blockquote>
              <div className="cq-author"><b>{cs.quote.author}</b> · {cs.quote.role}</div>
            </RevealWrapper>
          )}
        </div>
      </section>

      {/* RELATED */}
      <section className="section theme-dark">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680, marginBottom: 4 }}>
            <span className="eyebrow">Keep exploring</span>
            <h2 className="h2" style={{ marginTop: 18 }}>More results.</h2>
          </RevealWrapper>
          <div className="cs-grid">
            {related.map(r => <CaseStudyCard key={r.slug} cs={r} />)}
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

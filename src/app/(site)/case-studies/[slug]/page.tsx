import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMeta } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Arrow } from '@/components/ui/Arrow'
import { linkify } from '@/lib/linkify'
import { Marquee } from '@/components/layout/Marquee'
import { CtaSection } from '@/components/ui/CtaSection'
import { CaseStudyCard } from '@/components/case-studies/CaseStudyCard'
import { CaseStudyHeroCtas } from '@/components/case-studies/CaseStudyHeroCtas'
import { getCaseStudy, getAllCaseStudySlugs, CASE_STUDIES, type CaseStudy } from '@/data/case-studies'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCaseStudyEntries, handlePayloadReadError, staticFallbackEnabled } from '@/lib/content'

/**
 * ISR — see services/[slug]. Invalidated on demand by the CaseStudies
 * collection's afterChange/afterDelete hooks.
 */
export const revalidate = 3600

/** Prerender every known case study — see services/[slug] for rationale. */
export async function generateStaticParams() {
  const entries = await getCaseStudyEntries()
  return entries.map(e => ({ slug: e.slug }))
}

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

async function fetchCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'case-studies', where: { slug: { equals: slug } }, limit: 1 })
    if (docs.length > 0) return payloadToCaseStudy(docs[0])
  } catch (e) {
    handlePayloadReadError(`case study ${slug}`, e)
  }
  return staticFallbackEnabled() ? getCaseStudy(slug) : null
}

async function fetchAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'case-studies', limit: 100 })
    if (docs.length > 0 || !staticFallbackEnabled()) return docs.map(payloadToCaseStudy)
  } catch (e) {
    handlePayloadReadError('case studies (related)', e)
  }
  return CASE_STUDIES
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const cs = await fetchCaseStudy(slug)
  if (!cs) return {}
  return buildMeta({
    title: `${cs.client} Case Study — ${cs.result} | Agentix`,
    description: `${cs.client} — ${cs.result}. ${cs.lead}`,
    canonical: `${SITE_URL}/case-studies/${slug}`,
  })
}

export default async function CaseStudyPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const cs = await fetchCaseStudy(slug)
  if (!cs) notFound()

  const all = await fetchAllCaseStudies()
  const related = all.filter(c => c.slug !== slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${cs.client} — ${cs.result}`,
    description: cs.lead,
    author: { '@type': 'Organization', name: 'Agentix', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Agentix', url: SITE_URL },
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
              <p className="svc-lead">{linkify(cs.lead)}</p>
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
            <p className="csd-body">{linkify(cs.challenge)}</p>
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
                <p>{linkify(d)}</p>
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
              <blockquote>&ldquo;{linkify(cs.quote.text)}&rdquo;</blockquote>
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

      <section className="section theme-dark" style={{ paddingTop: 0, paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
        <div className="wrap">
          <RevealWrapper>
            <span className="eyebrow">Keep reading</span>
            <div className="link-row" style={{ marginTop: 20 }}>
              <Link href="/case-studies">All case studies <Arrow s={14} /></Link>
              <Link href="/results">Results &amp; proof <Arrow s={14} /></Link>
              <Link href="/services/ecommerce-seo-online-stores">Ecommerce SEO <Arrow s={14} /></Link>
              <Link href="/services/custom-shopify-store-development">Shopify development <Arrow s={14} /></Link>
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

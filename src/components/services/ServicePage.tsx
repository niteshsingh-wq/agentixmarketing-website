import Link from 'next/link'
import { Arrow } from '@/components/ui/Arrow'
import { Faq } from '@/components/ui/Faq'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Marquee } from '@/components/layout/Marquee'
import { LeadSection } from '@/components/home/LeadSection'
import { CtaBand } from '@/components/home/CtaBand'
import { ServiceHeroCtas, ServiceIntroCta } from './ServiceCtas'
import { getServiceExtras, getRelatedServices } from './serviceExtras'
import { linkify } from '@/lib/linkify'
import type { Service } from '@/data/services'

export function ServicePage({ service: S }: { service: Service }) {
  const { intro, expert, successStats } = getServiceExtras(S)
  const related = getRelatedServices(S.slug, S.category)
  const isViz = S.category === 'Digital Marketing'
  const skip = `/services/${S.slug}`

  return (
    <>
      {/* ── 1. HERO ── */}
      <section className="svc-hero theme-dark" id="top">
        <div className="hero-glow"></div>
        <div className="wrap">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span>
            <Link href="/#services">{S.category}</Link><span className="sep">/</span>
            <span className="here">{S.title}</span>
          </nav>
          <div className="svc-hero-grid">
            <div>
              <span className="eyebrow">{S.tag}</span>
              <h1 className="svc-title" style={{ marginTop: 18 }}>{S.title}</h1>
              <p className="svc-lead">{linkify(S.lead, skip)}</p>
              <ServiceHeroCtas />
            </div>
            <RevealWrapper className="svc-statcard">
              {S.stats.map((s, i) => (
                <div className="ss" key={i}>
                  <span className="n">{s.n}</span>
                  <span className="l">{s.l}</span>
                </div>
              ))}
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* ── MARQUEE BAND ── */}
      <section className="theme-dark" style={{ padding: '20px 0 36px', borderBlock: '1px solid var(--ink-line)' }}>
        <Marquee />
      </section>

      {/* ── 2. WHY IT MATTERS ── */}
      <section className="section theme-light">
        <div className="wrap">
          <div className="svc-intro">
            <RevealWrapper>
              <span className="eyebrow">Why it matters</span>
              <h2 style={{ marginTop: 18 }}>{intro.heading}</h2>
              <p className="si-sub">{linkify(intro.sub, skip)}</p>
              <ul className="si-points">
                {intro.points.map((p, i) => (
                  <li key={i}><Arrow s={18} />{linkify(p, skip)}</li>
                ))}
              </ul>
            </RevealWrapper>
            <RevealWrapper className="si-card">
              <p className="sic-q">
                {intro.cardQ[0]}<b>{intro.cardQ[1]}</b>{intro.cardQ[2]}
              </p>
              <ServiceIntroCta />
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* ── 3. DELIVERABLES (what's included) ── */}
      <section className="section theme-dark">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">What&apos;s included</span>
            <h2 className="h2" style={{ marginTop: 18 }}>Everything you get with {S.title}.</h2>
          </RevealWrapper>
          <div className="inc-grid">
            {S.deliverables.map(([t, d], i) => (
              <RevealWrapper key={i} className="inc-card">
                <div className="inc-num">{String(i + 1).padStart(2, '0')}</div>
                <h4>{t}</h4>
                <p>{linkify(d, skip)}</p>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. PROCESS ── */}
      <section className="section theme-light">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">How it works</span>
            <h2 className="h2" style={{ marginTop: 18 }}>A clear path from audit to growth.</h2>
          </RevealWrapper>
          <div className="proc">
            {S.process.map(([t, d], i) => (
              <RevealWrapper key={i} className={'proc-step' + (i === 0 ? ' lit' : '')}>
                <span className="pi">Step {String(i + 1).padStart(2, '0')}</span>
                <h4>{t}</h4>
                <p>{linkify(d, skip)}</p>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. THE AGENTIX DIFFERENCE + SUCCESS STATS ── */}
      <section className="section theme-dark expert">
        <div className="wrap">
          <RevealWrapper>
            <span className="eyebrow">The Agentix difference</span>
            <h2 style={{ marginTop: 18 }}>{expert.heading}</h2>
            <p className="ex-desc">{linkify(expert.desc, skip)}</p>
          </RevealWrapper>
          <div className="expert-grid">
            <div className="insights">
              {expert.insights.map(([t, d], i) => (
                <RevealWrapper key={i} className="insight">
                  <span className="ins-badge">#{i + 1}</span>
                  <p><b>{t}</b> {linkify(d, skip)}</p>
                </RevealWrapper>
              ))}
            </div>
            <RevealWrapper className="result-card">
              <div className="rc-l">Typical result</div>
              <div className="rc-n">{expert.result.n}</div>
              <div className="rc-d">{expert.result.l}</div>
            </RevealWrapper>
          </div>
          <div className="success-stats">
            {successStats.map(([n, l, c], i) => (
              <RevealWrapper key={i} className="success-cell">
                <div className="sn">{n}</div>
                <div className="sl">{l}</div>
                <div className="sc">{c}</div>
              </RevealWrapper>
            ))}
          </div>
          <RevealWrapper>
            <div className="link-row">
              <Link href="/case-studies">See client case studies <Arrow s={14} /></Link>
              <Link href="/results">Results &amp; proof <Arrow s={14} /></Link>
              <Link href="/contact">Book a free strategy call <Arrow s={14} /></Link>
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* ── 6. INLINE LEAD CAPTURE ── */}
      <LeadSection />

      {/* ── 7. FAQ ── */}
      {S.faqs.length > 0 && (
        <section className="section theme-light">
          <div className="wrap">
            <RevealWrapper style={{ maxWidth: 680 }}>
              <span className="eyebrow">Questions</span>
              <h2 className="h2" style={{ marginTop: 18 }}>Good to know.</h2>
            </RevealWrapper>
            <RevealWrapper>
              <Faq items={S.faqs} skip={`/services/${S.slug}`} />
            </RevealWrapper>
          </div>
        </section>
      )}

      {/* ── 8. RELATED SERVICES ── */}
      {related.length > 0 && (
        <section className="section theme-dark" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <RevealWrapper style={{ maxWidth: 680, marginBottom: 4 }}>
              <span className="eyebrow">Keep exploring</span>
              <h2 className="h2" style={{ marginTop: 18 }}>Related {S.category} services.</h2>
            </RevealWrapper>
            <div className="rel-grid">
              {related.map(r => (
                <Link key={r.slug} className="rel-card" href={`/services/${r.slug}`}>
                  <span className="rc-cat">{r.category}</span>
                  <h4>{r.name} <Arrow s={18} /></h4>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 9. CTA BAND ── */}
      <CtaBand />
    </>
  )
}

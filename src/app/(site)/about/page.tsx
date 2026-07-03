import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMeta } from '@/lib/metadata'
import { PageHero } from '@/components/ui/PageHero'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Marquee } from '@/components/layout/Marquee'
import { CtaSection } from '@/components/ui/CtaSection'
import { Arrow } from '@/components/ui/Arrow'
import { linkify } from '@/lib/linkify'

export const metadata: Metadata = buildMeta({
  title: 'About Agentix — Shopify Development & SEO Agency',
  description: 'Agentix is a specialist Shopify development and SEO agency. We build stores, rank them and grow them — as one integrated growth engine.',
  canonical: 'https://agentixmarketing.com/about',
})

const PRINCIPLES: [string, string, string][] = [
  ['01', 'Build to rank', 'Stores architected for search from the first line of code — never retrofitted with expensive remediation after launch.'],
  ['02', 'Rank to convert', "Rankings only matter if they turn into revenue. We tune for buyers and conversion, not just traffic and impressions."],
  ['03', 'Convert to grow', 'Every win compounds — speed, CRO and retention working together so growth keeps building on itself.'],
]

const DIFFERENTIATORS: [string, string][] = [
  ['Senior-led always', 'No junior account managers. Every engagement is led by a specialist with 8+ years of ecommerce experience.'],
  ['Two disciplines, one team', "Shopify development and SEO sit in the same room, informing each other — not handed between siloed agencies."],
  ['US market expertise', 'Our primary focus is US search, US buyer behaviour and the US competitive landscapes our clients compete in.'],
  ['No lock-in', "Month-to-month on ongoing services — because we'd rather earn your renewal than contractually require it."],
]

const PARTNERS: [string, string, string?][] = [
  ['S', 'Shopify Partner', 'https://www.shopify.com/partners/directory/partner/nickso'],
  ['S+', 'Shopify Plus Partner', 'https://www.shopify.com/partners/directory/partner/nickso'],
  ['G', 'Google Partner'],
]

const TEAM: [string, string, string, string][] = [
  ['NS', 'Nitesh Singh', 'Founder & Director, Shopify Development', 'Founded Agentix on the conviction that Shopify and SEO should never be separated. Leads development strategy and shapes every client engagement from the ground up.'],
  ['CC', 'Chetan Choudhary', 'General Manager, Digital Marketing & SEO', 'Drives organic growth strategy across the agency — blending technical SEO with precision digital marketing to turn rankings into real revenue.'],
  ['PP', 'Prashant Pandit', 'CTO, Shopify & Shopify Plus Development', 'Architects complex Shopify Plus builds, custom apps and deep integrations. The technical backbone behind every store we ship.'],
  ['KS', 'Khushal Singh', 'Digital Marketing Strategist', 'Executes performance-driven campaigns across paid and organic channels — converting traffic into measurable, compounding growth.'],
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Agentix"
        title="We build stores. We rank them. We grow them."
        sub="Agentix is a specialist Shopify development and SEO agency operating across the US and UK. We don't split the two disciplines — we run them as one growth engine."
      />

      <section className="theme-dark" style={{ padding: '20px 0 36px', borderBlock: '1px solid var(--ink-line)' }}>
        <Marquee />
      </section>

      {/* STORY */}
      <section className="section theme-light">
        <div className="wrap">
          <div className="svc-intro">
            <RevealWrapper>
              <span className="eyebrow">Our story</span>
              <h2 style={{ marginTop: 18 }}>Why we exist.</h2>
              <p className="si-sub">
                Most ecommerce agencies are either developers who don&apos;t understand <Link href="/services/seo-strategy-implementation" className="page-link">SEO</Link>, or SEO agencies who don&apos;t understand how stores are built. We started Agentix because we saw how much was left on the table when those two disciplines didn&apos;t talk to each other.
              </p>
              <p className="si-sub" style={{ marginTop: 16 }}>
                A store built without SEO architecture needs expensive remediation. An <Link href="/services/on-page-technical-seo" className="page-link">SEO strategy</Link> disconnected from how <Link href="/services/custom-shopify-store-development" className="page-link">Shopify</Link> actually works produces rankings that don&apos;t convert. We built an agency where both practices are in the same room, informed by each other, from day one.
              </p>
            </RevealWrapper>
            <RevealWrapper>
              <div className="principle-list">
                {PRINCIPLES.map(([n, t, d]) => (
                  <div className="principle" key={t}>
                    <span className="pr-n">{n}</span>
                    <h4>{t}</h4>
                    <p>{linkify(d, '/about')}</p>
                  </div>
                ))}
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="section theme-dark">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">What makes us different</span>
            <h2 className="h2" style={{ marginTop: 18 }}>A different kind of ecommerce partner.</h2>
          </RevealWrapper>
          <div className="diff-grid">
            {DIFFERENTIATORS.map(([t, d], i) => (
              <RevealWrapper key={t} className="diff-card">
                <div className="df-n">{String(i + 1).padStart(2, '0')}</div>
                <h4>{t}</h4>
                <p>{linkify(d, '/about')}</p>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER BADGES */}
      <section className="theme-dark" style={{ padding: 'clamp(40px, 5vw, 64px) 0', borderTop: '1px solid var(--ink-line)' }}>
        <div className="wrap">
          <RevealWrapper>
            <p style={{ textAlign: 'center', color: 'var(--ink-muted)', fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 28 }}>
              Accredited partners
            </p>
            <div className="partner-strip">
              {PARTNERS.map(([mark, label, href]) => (
                href ? (
                  <a className="partner-badge" key={label} href={href} target="_blank" rel="noopener noreferrer">
                    <span className="pb-mark">{mark}</span>{label}
                  </a>
                ) : (
                  <span className="partner-badge" key={label}>
                    <span className="pb-mark">{mark}</span>{label}
                  </span>
                )
              ))}
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* TEAM */}
      <section className="section theme-light">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">The team</span>
            <h2 className="h2" style={{ marginTop: 18 }}>The people behind the work.</h2>
            <p className="lead" style={{ marginTop: 20 }}>A small, senior team — no account managers, no juniors running your project.</p>
          </RevealWrapper>
          <div className="team-grid">
            {TEAM.map(([initials, name, role, bio]) => (
              <RevealWrapper key={name} className="team-card">
                <div className="team-avatar">{initials}</div>
                <h4>{name}</h4>
                <div className="tc-role">{role}</div>
                <p className="tc-bio">{linkify(bio, '/about')}</p>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="section theme-light" style={{ paddingTop: 0, paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
        <div className="wrap">
          <RevealWrapper>
            <span className="eyebrow">Explore</span>
            <div className="link-row" style={{ marginTop: 20 }}>
              <Link href="/case-studies">Case studies <Arrow s={14} /></Link>
              <Link href="/results">Results &amp; proof <Arrow s={14} /></Link>
              <Link href="/services/custom-shopify-store-development">Shopify development <Arrow s={14} /></Link>
              <Link href="/services/seo-strategy-implementation">SEO services <Arrow s={14} /></Link>
              <Link href="/contact">Work with us <Arrow s={14} /></Link>
            </div>
          </RevealWrapper>
        </div>
      </section>

      <CtaSection
        eyebrow="Work with us"
        heading="Work with a team that builds and ranks."
        sub="Book a free 30-minute strategy session with a senior specialist — not a sales rep. We'll show you exactly where your growth is."
        btn="Book a strategy call"
      />
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMeta } from '@/lib/metadata'
import { PageHero } from '@/components/ui/PageHero'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Marquee } from '@/components/layout/Marquee'
import { RoleCard } from '@/components/careers/RoleCard'
import { linkify } from '@/lib/linkify'

export const metadata: Metadata = buildMeta({
  title: 'Careers at Agentix — Join Our Shopify & SEO Team',
  description: 'Join a small, senior team doing their best work. Remote-first roles in Shopify development and SEO for US and UK timezones.',
  canonical: 'https://agentixmarketing.com/careers',
})

const WHY: [string, string][] = [
  ['Do your best work', "A small team means your work ships, matters and is visible — no bureaucracy, no committees, no work that disappears into a deck."],
  ['Senior by default', "You'll work alongside people who've done this for a decade — and learn faster because of it. No layers between you and the craft."],
  ["Clients that trust us", "We work with brands that give us real ownership of the outcomes — no micromanagement, and no scope creep we do for free."],
]

const ROLES = [
  { title: 'Senior Shopify Developer', meta: ['Full-time', 'Remote', 'US or UK timezone'], req: '4+ years Shopify, strong Liquid, custom app development. Shopify Plus experience preferred.', does: 'Lead builds, own architecture decisions and work directly with clients from kickoff to launch.' },
  { title: 'SEO Strategist', meta: ['Full-time', 'Remote', 'US timezone preferred'], req: '3+ years ecommerce SEO, technical SEO proficiency and content strategy experience.', does: 'Own client SEO programs end-to-end — write the strategy and oversee content and link building.' },
  { title: 'Shopify Project Manager', meta: ['Full-time', 'Remote', 'US timezone'], req: "2+ years agency PM experience, working Shopify knowledge and strong client communication.", does: "Coordinate builds, manage timelines and be the client's primary contact during projects." },
]

const VALUES = ['Ship work you\'re proud of', 'Communicate clearly, always', 'Own the outcome', 'No ego, all craft']

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build great work with people who care about it."
        sub="We're a small, senior team. When we hire, we hire for the long term."
        actions={
          <div className="badge-row">
            <span className="pill">Remote-first</span>
            <span className="pill">Senior team only</span>
            <span className="pill">US &amp; UK</span>
          </div>
        }
      />

      <section className="theme-dark" style={{ padding: '20px 0 36px', borderBlock: '1px solid var(--ink-line)' }}>
        <Marquee />
      </section>

      {/* WHY AGENTIX */}
      <section className="section theme-light">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">Why Agentix</span>
            <h2 className="h2" style={{ marginTop: 18 }}>A place to do the best work of your career.</h2>
          </RevealWrapper>
          <div className="why-grid">
            {WHY.map(([t, d]) => (
              <RevealWrapper key={t} className="why-col">
                <h3>{t}</h3>
                <p>{linkify(d, '/careers')}</p>
              </RevealWrapper>
            ))}
          </div>
          <RevealWrapper style={{ marginTop: 40 }}>
            <p className="si-sub" style={{ maxWidth: 640 }}>
              We&apos;re the team behind <Link href="/case-studies" className="page-link">real ecommerce growth</Link> for brands across the US — combining{' '}
              <Link href="/services/custom-shopify-store-development" className="page-link">Shopify development</Link> and{' '}
              <Link href="/services/seo-strategy-implementation" className="page-link">SEO strategy</Link> under one roof.{' '}
              Learn more <Link href="/about" className="page-link">about the team</Link> or read our{' '}
              <Link href="/results" className="page-link">results</Link> before applying.
            </p>
          </RevealWrapper>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section className="section theme-dark">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">Open roles</span>
            <h2 className="h2" style={{ marginTop: 18 }}>Roles we&apos;re hiring for.</h2>
          </RevealWrapper>
          <div className="role-list">
            {ROLES.map(r => (
              <RevealWrapper key={r.title}>
                <RoleCard role={r} />
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CULTURE / VALUES */}
      <section className="section theme-dark" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">How we work</span>
            <h2 className="h2" style={{ marginTop: 18 }}>What we value.</h2>
          </RevealWrapper>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <RevealWrapper key={v} className="value-cell">
                <span className="vc-n">/{String(i + 1).padStart(2, '0')}</span>
                <h4>{v}</h4>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

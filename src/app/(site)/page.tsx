import type { Metadata } from 'next'
import { buildMeta } from '@/lib/metadata'
import { Hero } from '@/components/home/Hero'
import { IntroBand } from '@/components/home/IntroBand'
import { ServicesSection } from '@/components/home/ServicesSection'
import { ServicesExplorer } from '@/components/home/ServicesExplorer'
import { ProofSection } from '@/components/home/ProofSection'
import { CapabilityColumns } from '@/components/home/CapabilityColumns'
import { CasesSection } from '@/components/home/CasesSection'
import { ExcellenceLists } from '@/components/home/ExcellenceLists'
import { ClientShowcase } from '@/components/home/ClientShowcase'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { LeadSection } from '@/components/home/LeadSection'
import { CtaBand } from '@/components/home/CtaBand'
import { Marquee } from '@/components/layout/Marquee'

export const metadata: Metadata = buildMeta({
  title: 'Agentix Marketing — Shopify Development & SEO Agency',
  description: 'A results-driven Shopify & SEO partner. Custom store development, conversion optimization and search visibility — engineered to grow your ecommerce revenue.',
  canonical: 'https://agentixmarketing.com',
  ogImage: 'https://agentixmarketing.com/og-default.jpg',
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Agentix Marketing',
  url: 'https://agentixmarketing.com',
  description: 'Specialist Shopify development and SEO agency — Agentix Marketing Private Limited',
  areaServed: 'US',
  sameAs: [],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero variant="split" />

      <section className="theme-dark" style={{ padding: '26px 0 40px', borderBottom: '1px solid var(--ink-line)' }}>
        <div className="wrap" style={{ marginBottom: 18 }}>
          <span style={{ fontSize: 12.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 500 }}>
            Trusted by brands shipping real revenue
          </span>
        </div>
        <Marquee />
      </section>

      <IntroBand />
      <ServicesSection />
      <ServicesExplorer />
      <ProofSection />
      <CapabilityColumns />
      <CasesSection />
      <ExcellenceLists />
      <ClientShowcase />
      <TestimonialsSection />
      <LeadSection />
      <CtaBand />
    </>
  )
}

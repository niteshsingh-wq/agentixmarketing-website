import type { Metadata } from 'next'
import { buildMeta } from '@/lib/metadata'
import { PageHero } from '@/components/ui/PageHero'
import { Faq } from '@/components/ui/Faq'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { Marquee } from '@/components/layout/Marquee'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactSide } from '@/components/contact/ContactSide'
import { ContactHeroCtas } from '@/components/contact/ContactHeroCtas'

export const metadata: Metadata = buildMeta({
  title: "Contact Agentix — Free Strategy Call & SEO Audit",
  description: "Book a free 30-minute strategy session or request your free SEO audit. No pitch decks. No obligation. We respond within one business day.",
  canonical: 'https://agentixmarketing.com/contact',
})

const CONTACT_FAQS: [string, string][] = [
  ["How quickly do you respond?", "Within one business day, every time. If you book a strategy call you'll also get a slot to choose immediately — no back-and-forth."],
  ["Do you work with businesses outside ecommerce?", "Our focus is ecommerce and Shopify specifically — that's where we're strongest. If you're adjacent (a brand moving into DTC, for example) we're happy to talk and tell you honestly if we're the right fit."],
  ["What's the minimum engagement?", "Project work is scoped to the build. Ongoing SEO and growth retainers are month-to-month with no long lock-in — we'd rather earn the renewal than require it."],
  ["Do you work with US-based clients?", "Yes. We cover US and UK business hours and our primary focus is the US search and ecommerce market — US buyer behaviour, US competitive landscapes and US-based results."],
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build something worth ranking."
        sub="Book a free 30-minute strategy call or request your free SEO audit. No pitch decks. No obligation."
        actions={<ContactHeroCtas />}
      />

      <section className="theme-dark" style={{ padding: '20px 0 36px', borderBlock: '1px solid var(--ink-line)' }}>
        <Marquee />
      </section>

      <section className="section theme-light">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">Get in touch</span>
            <h2 className="h2" style={{ marginTop: 18 }}>Two ways in. Both free.</h2>
          </RevealWrapper>
          <div className="contact-grid">
            <RevealWrapper><ContactForm /></RevealWrapper>
            <RevealWrapper><ContactSide /></RevealWrapper>
          </div>
        </div>
      </section>

      <section className="section theme-dark">
        <div className="wrap">
          <RevealWrapper style={{ maxWidth: 680 }}>
            <span className="eyebrow">Questions</span>
            <h2 className="h2" style={{ marginTop: 18 }}>Before you reach out.</h2>
          </RevealWrapper>
          <RevealWrapper><Faq items={CONTACT_FAQS} /></RevealWrapper>
        </div>
      </section>
    </>
  )
}

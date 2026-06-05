'use client'
import { Arrow } from '@/components/ui/Arrow'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { useLeadModal } from '@/components/lead/LeadContext'

interface CtaSectionProps {
  eyebrow?: string
  heading: string
  sub?: string
  btn?: string
}

export function CtaSection({ eyebrow = "Let's build", heading, sub, btn = 'Book a strategy call' }: CtaSectionProps) {
  const { openLead } = useLeadModal()
  return (
    <section className="section theme-dark cta-band">
      <div className="wrap">
        <RevealWrapper className="cta-card">
          <div className="cta-blob"></div>
          <span className="eyebrow" style={{ color: '#04263c' }}>{eyebrow}</span>
          <h2 style={{ marginTop: 18 }}>{heading}</h2>
          {sub && <p>{sub}</p>}
          <button className="btn btn-solid" onClick={() => openLead('form')}>
            {btn} <Arrow />
          </button>
        </RevealWrapper>
      </div>
    </section>
  )
}

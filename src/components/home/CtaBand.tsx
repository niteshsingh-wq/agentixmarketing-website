'use client'
import { Arrow } from '@/components/ui/Arrow'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { useLeadModal } from '@/components/lead/LeadContext'

export function CtaBand() {
  const { openLead } = useLeadModal()
  return (
    <section className="section theme-dark cta-band">
      <div className="wrap">
        <RevealWrapper className="cta-card">
          <div className="cta-blob"></div>
          <span className="eyebrow" style={{ color: '#04263c' }}>Let&apos;s build</span>
          <h2 style={{ marginTop: 18 }}>Your store can do a lot more than it&apos;s doing.</h2>
          <p>Book a free 30-minute strategy session. We&apos;ll audit your store live and leave you
            with three things to fix — whether you work with us or not.</p>
          <button className="btn btn-solid" onClick={() => openLead('form')}>
            Get your free strategy session <Arrow />
          </button>
        </RevealWrapper>
      </div>
    </section>
  )
}

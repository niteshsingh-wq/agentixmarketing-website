'use client'
import { useLeadModal } from '@/components/lead/LeadContext'

export function ContactSide() {
  const { openLead } = useLeadModal()

  const engage = [
    { title: 'Strategy Call', meta: '30 min · free', desc: "A senior specialist audits your store live and leaves you with clear next steps. Book a slot via Calendly.", fn: () => openLead('form') },
    { title: 'SEO Audit', meta: 'Free · 48hr', desc: 'Request a free site review. We score your store against best practice and send a prioritised fix list.', fn: () => openLead('audit') },
    { title: 'Project Brief', meta: 'Send & scope', desc: "Already have a brief? Send it over and we'll scope it, flag risks and come back with an honest plan.", fn: () => openLead('form') },
  ]

  return (
    <div className="contact-side">
      <div className="detail-block">
        <div className="detail-row">
          <span className="dr-k">Email</span>
          <span className="dr-v"><a href="mailto:connect@agentixmarketing.com">connect@agentixmarketing.com</a></span>
        </div>
        <div className="detail-row">
          <span className="dr-k">Response time</span>
          <span className="dr-v">Within 1 business day</span>
        </div>
        <div className="detail-row">
          <span className="dr-k">Timezone</span>
          <span className="dr-v">US &amp; UK hours covered</span>
        </div>
      </div>
      <div className="engage-list">
        {engage.map((item, i) => (
          <div className="engage-card" key={i} role="button" onClick={item.fn} style={{ cursor: 'pointer' }}>
            <h4>{item.title}</h4>
            <span className="ec-meta">{item.meta}</span>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

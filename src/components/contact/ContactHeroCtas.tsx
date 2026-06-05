'use client'
import { Arrow } from '@/components/ui/Arrow'
import { useLeadModal } from '@/components/lead/LeadContext'

export function ContactHeroCtas() {
  const { openLead } = useLeadModal()
  return (
    <div className="ph-actions">
      <button className="btn btn-primary" onClick={() => openLead('form')}>Book a strategy call <Arrow /></button>
      <button className="btn btn-ghost" onClick={() => openLead('audit')}>Request free SEO audit</button>
    </div>
  )
}

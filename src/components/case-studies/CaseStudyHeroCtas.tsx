'use client'
import { Arrow } from '@/components/ui/Arrow'
import { useLeadModal } from '@/components/lead/LeadContext'

export function CaseStudyHeroCtas() {
  const { openLead } = useLeadModal()
  return (
    <div className="svc-actions">
      <button className="btn btn-primary" onClick={() => openLead('form')}>Book a strategy call <Arrow /></button>
      <button className="btn btn-ghost" onClick={() => openLead('audit')}>Free SEO audit</button>
    </div>
  )
}

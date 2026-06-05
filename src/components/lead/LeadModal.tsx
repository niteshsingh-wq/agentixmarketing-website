'use client'
import { useEffect, useState } from 'react'
import { useLeadModal } from './LeadContext'
import { StrategyForm } from './StrategyForm'
import { AuditTool } from './AuditTool'

export function LeadModal() {
  const { modal, closeLead, setMode } = useLeadModal()

  useEffect(() => {
    if (!modal.open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLead() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [modal.open, closeLead])

  if (!modal.open) return null

  return (
    <div className="lead-modal-overlay" onClick={closeLead}>
      <div className="lead-modal theme-dark" onClick={e => e.stopPropagation()}>
        <button className="lead-modal-close" onClick={closeLead} aria-label="Close">✕</button>
        <div className="lead-shell" style={{ marginTop: 0, gridTemplateColumns: '1fr' }}>
          <div className="lead-card" style={{ background: 'transparent', border: 'none', padding: 0 }}>
            <div className="lead-switch">
              <button className={modal.mode === 'form' ? 'on' : ''} onClick={() => setMode('form')}>Strategy session</button>
              <button className={modal.mode === 'audit' ? 'on' : ''} onClick={() => setMode('audit')}>Instant SEO audit</button>
            </div>
            {modal.mode === 'form'
              ? <StrategyForm onDone={closeLead} />
              : <AuditTool key={modal.initialUrl || 'fresh'} initialUrl={modal.initialUrl} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export function InlineLeadCard({ defaultMode = 'form' }: { defaultMode?: 'form' | 'audit' }) {
  const [mode, setMode] = useState<'form' | 'audit'>(defaultMode)
  return (
    <>
      <div className="lead-switch">
        <button className={mode === 'form' ? 'on' : ''} onClick={() => setMode('form')}>Strategy session</button>
        <button className={mode === 'audit' ? 'on' : ''} onClick={() => setMode('audit')}>Instant SEO audit</button>
      </div>
      {mode === 'form'
        ? <StrategyForm onDone={() => setMode('form')} />
        : <AuditTool />}
    </>
  )
}

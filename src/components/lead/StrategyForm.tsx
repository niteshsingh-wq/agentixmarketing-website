'use client'
import { useState } from 'react'
import { Arrow, Check } from '@/components/ui/Arrow'

const FORM_STEPS = [
  { key: 'goal', title: 'What do you need help with?', hint: 'Pick the closest fit — we\'ll tailor the call around it.', type: 'choice', options: ['SEO & visibility', 'Store design / build', 'Migration to Shopify', 'Conversion (CRO)', 'Headless / Plus', 'Not sure yet'] },
  { key: 'stage', title: 'Where\'s your store today?', hint: 'So we know what we\'re starting from.', type: 'choice', options: ['Pre-launch', 'Live, under $50k/mo', '$50k–250k/mo', '$250k+/mo'] },
  { key: 'budget', title: 'Monthly budget for growth?', hint: 'A rough range is fine — it helps us scope realistically.', type: 'range' },
  { key: 'contact', title: 'Where should we send your plan?', hint: 'We\'ll reach out within one business day. No spam, ever.', type: 'contact' },
] as const

function budgetLabel(v: number) {
  if (v < 2) return 'Under $2k / mo'
  if (v >= 20) return '$20k+ / mo'
  return `$${v}k / mo`
}

interface FormData {
  goal: string; stage: string; budget: number
  name: string; email: string; phone: string; website: string
}

export function StrategyForm({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>({ goal: '', stage: '', budget: 7, name: '', email: '', phone: '', website: '' })
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (k: keyof FormData, v: string | number) => setData(d => ({ ...d, [k]: v }))
  const cur = FORM_STEPS[step]

  const canNext = () => {
    if (cur.type === 'choice') return !!(data as any)[cur.key]
    if (cur.type === 'contact') return data.name.trim() !== '' && /\S+@\S+\.\S+/.test(data.email)
    return true
  }

  const next = async () => {
    if (step < FORM_STEPS.length - 1) { setStep(step + 1); return }
    setSubmitting(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, budget: budgetLabel(data.budget), sourcePage: window.location.pathname }),
      })
    } catch {}
    setSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="lead-success">
        <div className="tick"><Check s={30} /></div>
        <h3>You&apos;re booked in.</h3>
        <p>Thanks {data.name.split(' ')[0] || 'there'} — we&apos;ll email {data.email} within one business day with next steps and a slot to choose.</p>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={onDone}>Done</button>
      </div>
    )
  }

  return (
    <>
      <div className="lead-progress">
        {FORM_STEPS.map((_, i) => (
          <div key={i} className={'seg' + (i < step ? ' done' : i === step ? ' active' : '')}><i></i></div>
        ))}
        <span className="lead-step-label">{step + 1} / {FORM_STEPS.length}</span>
      </div>

      <div className="lead-step" key={step}>
        <h3>{cur.title}</h3>
        <p className="step-hint">{cur.hint}</p>

        {cur.type === 'choice' && (
          <div className="choice-grid">
            {cur.options.map((o) => (
              <button key={o} className={'choice' + ((data as any)[cur.key] === o ? ' sel' : '')}
                onClick={() => set(cur.key as keyof FormData, o)}>
                <span className="ci"><Check s={14} /></span>{o}
              </button>
            ))}
          </div>
        )}

        {cur.type === 'range' && (
          <div className="range-wrap">
            <div className="range-val">{budgetLabel(data.budget)}</div>
            <input type="range" min="1" max="20" step="1" value={data.budget}
              onChange={e => set('budget', +e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: 12.5, marginTop: 8 }}>
              <span>Under $2k</span><span>$20k+</span>
            </div>
          </div>
        )}

        {cur.type === 'contact' && (
          <>
            <div className="field">
              <label>Full name</label>
              <input value={data.name} onChange={e => set('name', e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="field">
              <label>Work email</label>
              <input type="email" value={data.email} onChange={e => set('email', e.target.value)} placeholder="jane@brand.com" />
            </div>
            <div className="field">
              <label>Phone number <span style={{ opacity: 0.6 }}>(optional, include country code)</span></label>
              <input type="tel" value={data.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 123 4567" />
            </div>
            <div className="field">
              <label>Website URL <span style={{ opacity: 0.6 }}>(optional)</span></label>
              <input value={data.website} onChange={e => set('website', e.target.value)} placeholder="yourstore.com" />
            </div>
          </>
        )}
      </div>

      <div className="lead-actions">
        <button className="lead-back" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
        <button className="btn btn-primary lead-next" disabled={!canNext() || submitting}
          style={{ opacity: canNext() ? 1 : 0.4, pointerEvents: canNext() ? 'auto' : 'none' }}
          onClick={next}>
          {step === FORM_STEPS.length - 1 ? (submitting ? 'Sending…' : 'Book my session') : 'Continue'} <Arrow />
        </button>
      </div>
    </>
  )
}

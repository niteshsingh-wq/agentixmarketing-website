'use client'
import { useState } from 'react'
import { Arrow, Check } from '@/components/ui/Arrow'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { useLeadModal } from '@/components/lead/LeadContext'
import { AGENTIX } from '@/data/site'

function HeroTop() {
  return (
    <div className="hero-top">
      <span className="pill"><span className="dot"></span> Booking Q3 projects</span>
      <span className="pill">Shopify Plus Partner</span>
      <span className="pill">SEO &amp; AI search</span>
    </div>
  )
}

function HeroStats() {
  return (
    <RevealWrapper className="hero-stats">
      {AGENTIX.heroStats.map((s, i) => (
        <div className="hero-stat" key={i}>
          <div className="n">{s.prefix ?? ''}<b>{s.n}</b>{s.suffix ?? ''}</div>
          <div className="l">{s.label}</div>
        </div>
      ))}
    </RevealWrapper>
  )
}

function HeroLeadForm() {
  const [d, setD] = useState({ name: '', email: '', phone: '', website: '', goal: 'Store design / build' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setD(s => ({ ...s, [k]: v }))
  const valid = d.name.trim() !== '' && /\S+@\S+\.\S+/.test(d.email)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...d, sourcePage: '/' }),
      })
      // Only confirm once the API says the lead was saved.
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(
          res.status === 429
            ? 'Too many requests from this connection. Please wait a few minutes and try again.'
            : body.error || 'Something went wrong. Please email connect@agentixmarketing.com directly.'
        )
        setSubmitting(false)
        return
      }
      setSent(true)
    } catch {
      setError('Network error. Please check your connection, or email connect@agentixmarketing.com directly.')
    }
    setSubmitting(false)
  }

  if (sent) {
    return (
      <div className="hero-form-card lead-card" style={{ minHeight: 'auto', justifyContent: 'center' }}>
        <div className="lead-success" style={{ flex: 'none' }}>
          <div className="tick"><Check s={28} /></div>
          <h3>Thanks, {d.name.split(' ')[0]}.</h3>
          <p>We&apos;ve got your details — a senior specialist will reach out within one business day.</p>
        </div>
      </div>
    )
  }

  return (
    <form className="hero-form-card lead-card" style={{ minHeight: 'auto' }} onSubmit={submit}>
      <div className="hero-form-head">
        <span className="eyebrow">Get started</span>
        <h3>Tell us about your project</h3>
        <p>Two minutes now saves weeks later. We&apos;ll come back with a tailored plan.</p>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Name</label>
          <input value={d.name} onChange={e => set('name', e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="field">
          <label>Work email</label>
          <input type="email" value={d.email} onChange={e => set('email', e.target.value)} placeholder="jane@brand.com" />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Phone number <span style={{ opacity: 0.6 }}>(optional)</span></label>
          <input type="tel" value={d.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 123 4567" />
        </div>
        <div className="field">
          <label>Website URL <span style={{ opacity: 0.6 }}>(optional)</span></label>
          <input value={d.website} onChange={e => set('website', e.target.value)} placeholder="yourstore.com" />
        </div>
      </div>
      <div className="field">
        <label>What do you need?</label>
        <select value={d.goal} onChange={e => set('goal', e.target.value)}>
          <option value="Store design / build">Shopify build</option>
          <option value="SEO & visibility">SEO &amp; visibility</option>
          <option value="Conversion (CRO)">Conversion (CRO)</option>
          <option value="Migration to Shopify">Migration to Shopify</option>
          <option value="Headless / Plus">Headless / Plus</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </div>
      {error && (
        <p role="alert" style={{ marginTop: 14, color: '#e5484d', fontSize: 14 }}>{error}</p>
      )}
      <button className="btn btn-primary" type="submit"
        style={{ marginTop: 18, width: '100%', justifyContent: 'center', opacity: valid ? 1 : 0.5 }}>
        Get my plan <Arrow />
      </button>
      <span className="lt-mini" style={{ marginTop: 12, textAlign: 'center', display: 'block' }}>
        ✓ No spam — one reply, real next steps.
      </span>
    </form>
  )
}

function HeroA() {
  const { openLead } = useLeadModal()
  return (
    <section className="hero hero-a theme-dark" id="top">
      <div className="hero-glow"></div>
      <div className="wrap">
        <HeroTop />
        <h1 className="hero-title">
          Build the store.<br />
          <span className="ink-blue">Rank</span> the brand.<br />
          <span className="outline">Grow</span> revenue.
        </h1>
        <div className="hero-sub">
          <p className="lead">
            Agentix is a Shopify &amp; SEO partner for ambitious ecommerce brands — we design and
            develop high-converting stores, then drive the search visibility that fills them.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => openLead('form')}>Free strategy session <Arrow /></button>
            <button className="btn btn-ghost" onClick={() => openLead('audit')}>Run a free SEO audit</button>
          </div>
        </div>
        <HeroStats />
      </div>
    </section>
  )
}

function HeroB() {
  const { openLead } = useLeadModal()
  return (
    <section className="hero hero-b theme-dark" id="top">
      <div className="hero-glow"></div>
      <div className="wrap">
        <HeroTop />
        <div className="hero-grid">
          <div>
            <h1 className="hero-title">We build &amp; <span className="ink-blue">rank</span> ecommerce brands.</h1>
            <p className="lead" style={{ marginTop: 26 }}>
              Shopify design, development and SEO — one team, engineered to turn visitors into revenue.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => openLead('form')}>Book a strategy call <Arrow /></button>
              <button className="btn btn-ghost" onClick={() => openLead('audit')}>Free SEO audit</button>
            </div>
          </div>
          <HeroLeadForm />
        </div>
        <HeroStats />
      </div>
    </section>
  )
}

function HeroC() {
  const { openLead } = useLeadModal()
  return (
    <section className="hero hero-c theme-dark" id="top">
      <div className="hero-glow"></div>
      <div className="wrap">
        <HeroTop />
        <h1 className="hero-title">Ecommerce growth,<br /><span className="ink-blue">engineered.</span></h1>
        <p className="lead">
          A results-driven Shopify &amp; SEO partner — we design and develop high-converting stores,
          then rank them. Build, visibility and revenue, working as one.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => openLead('form')}>Free strategy session <Arrow /></button>
          <button className="btn btn-ghost" onClick={() => openLead('audit')}>Run a free SEO audit</button>
        </div>
        <HeroStats />
      </div>
    </section>
  )
}

export function Hero({ variant = 'split' }: { variant?: 'editorial' | 'split' | 'centered' }) {
  if (variant === 'split') return <HeroB />
  if (variant === 'centered') return <HeroC />
  return <HeroA />
}

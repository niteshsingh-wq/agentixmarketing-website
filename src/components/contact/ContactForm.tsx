'use client'
import { useState } from 'react'
import { Arrow, Check } from '@/components/ui/Arrow'

interface FormData {
  name: string; email: string; phone: string; website: string
  need: string; message: string; company: string
}

export function ContactForm() {
  const [data, setData] = useState<FormData>({ name: '', email: '', phone: '', website: '', need: '', message: '', company: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const set = (k: keyof FormData, v: string) => setData(d => ({ ...d, [k]: v }))
  const valid = data.name.trim() !== '' && /\S+@\S+\.\S+/.test(data.email) && data.need !== ''

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (data.company) return // honeypot
    if (!valid) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sourcePage: '/contact' }),
      })
      // Previously the status was ignored and success was shown
      // unconditionally — a rate-limited or failed submission looked
      // identical to a delivered one.
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(
          res.status === 429
            ? 'Too many messages from this connection. Please wait a few minutes and try again.'
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
      <div className="contact-form-card">
        <div className="form-success">
          <div className="tick"><Check s={28} /></div>
          <h3>Message received.</h3>
          <p>Thanks {data.name.split(' ')[0]} — we&apos;ll reply to {data.email} within one business day with next steps. No spam, ever.</p>
          <button className="btn btn-ghost" style={{ marginTop: 22 }}
            onClick={() => { setSent(false); setData({ name: '', email: '', phone: '', website: '', need: '', message: '', company: '' }) }}>
            Send another message
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="contact-form-card" onSubmit={submit}>
      <h3>Send us a message</h3>
      <p className="cf-hint">Tell us what you&apos;re working on. We&apos;ll come back with specifics, not a sales pitch.</p>

      {/* honeypot */}
      <div className="hp-field" aria-hidden="true">
        <label>Leave this field empty</label>
        <input tabIndex={-1} autoComplete="off" value={data.company} onChange={e => set('company', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Name</label>
          <input value={data.name} onChange={e => set('name', e.target.value)} placeholder="Jane Doe" required />
        </div>
        <div className="field">
          <label>Business email</label>
          <input type="email" value={data.email} onChange={e => set('email', e.target.value)} placeholder="jane@brand.com" required />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Phone number <span style={{ opacity: 0.6 }}>(optional, include country code)</span></label>
          <input type="tel" value={data.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 123 4567" />
        </div>
        <div className="field">
          <label>Website URL</label>
          <input value={data.website} onChange={e => set('website', e.target.value)} placeholder="yourstore.com" />
        </div>
      </div>
      <div className="field">
        <label>What do you need?</label>
        <select value={data.need} onChange={e => set('need', e.target.value)} required>
          <option value="" disabled>Select an option…</option>
          <option>Shopify Development</option>
          <option>SEO &amp; Marketing</option>
          <option>Shopify + SEO</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="field">
        <label>Tell us about your project <span style={{ opacity: 0.6 }}>(optional)</span></label>
        <textarea rows={4} value={data.message} onChange={e => set('message', e.target.value)}
          placeholder="A few sentences on your store, goals or timeline…" />
      </div>
      {error && (
        <p className="cf-hint" role="alert" style={{ marginTop: 18, color: '#e5484d' }}>{error}</p>
      )}
      <button className="btn btn-primary" type="submit" disabled={!valid || submitting}
        style={{ marginTop: 22, opacity: valid ? 1 : 0.45, pointerEvents: valid ? 'auto' : 'none' }}>
        {submitting ? 'Sending…' : 'Send message'} <Arrow />
      </button>
    </form>
  )
}

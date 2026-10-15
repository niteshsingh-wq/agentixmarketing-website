'use client'
import { useState } from 'react'
import { Arrow, Check } from '@/components/ui/Arrow'
import { linkify } from '@/lib/linkify'

interface Role { title: string; meta: string[]; req: string; does: string }

export function RoleCard({ role }: { role: Role }) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({ name: '', email: '', phone: '', linkedin: '', why: '', company: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setData(d => ({ ...d, [k]: v }))
  const valid = data.name.trim() !== '' && /\S+@\S+\.\S+/.test(data.email)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    if (data.company) return // honeypot
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, role: role.title }),
      })
      // The status was previously ignored, so a blocked or failed application
      // still showed "Application received".
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(
          res.status === 429
            ? 'Too many applications from this connection. Please try again later.'
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

  return (
    <div className={'role-card' + (open ? ' open' : '')}>
      <div className="role-head">
        <div>
          <h3>{role.title}</h3>
          <div className="role-meta">
            {role.meta.map(m => <span className="tag" key={m}>{m}</span>)}
          </div>
        </div>
        <button className={'btn ' + (open ? 'btn-ghost' : 'btn-primary')} onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Apply'}{!open && <Arrow />}
        </button>
      </div>

      <div className="role-body">
        <div><h5>Requirements</h5><p>{linkify(role.req, '/careers')}</p></div>
        <div><h5>What you&apos;ll do</h5><p>{linkify(role.does, '/careers')}</p></div>
      </div>

      {open && (
        <div className="role-apply">
          {sent ? (
            <div className="form-success">
              <div className="tick"><Check s={26} /></div>
              <h3>Application received.</h3>
              <p>Thanks {data.name.split(' ')[0]} — we review every application personally and will be in touch within a few days.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              {/* honeypot */}
              <div className="hp-field" aria-hidden="true">
                <label>Leave this field empty</label>
                <input tabIndex={-1} autoComplete="off" value={data.company} onChange={e => set('company', e.target.value)} />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Full name</label>
                  <input value={data.name} onChange={e => set('name', e.target.value)} placeholder="Jane Doe" required />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" value={data.email} onChange={e => set('email', e.target.value)} placeholder="jane@email.com" required />
                </div>
              </div>
              <div className="field">
                <label>Role</label>
                <input value={role.title} readOnly style={{ opacity: 0.7 }} />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Phone number <span style={{ opacity: 0.6 }}>(optional)</span></label>
                  <input type="tel" value={data.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 123 4567" />
                </div>
                <div className="field">
                  <label>LinkedIn URL <span style={{ opacity: 0.6 }}>(optional)</span></label>
                  <input value={data.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/you" />
                </div>
              </div>
              <div className="field">
                <label>Why Agentix?</label>
                <textarea rows={4} value={data.why} onChange={e => set('why', e.target.value)}
                  placeholder="Tell us what draws you to this role…" />
              </div>
              {error && (
                <p role="alert" style={{ marginTop: 16, color: '#e5484d', fontSize: 14 }}>{error}</p>
              )}
              <button className="btn btn-primary" type="submit" disabled={!valid || submitting}
                style={{ marginTop: 20, opacity: valid ? 1 : 0.45, pointerEvents: valid ? 'auto' : 'none' }}>
                {submitting ? 'Sending…' : 'Submit application'} <Arrow />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { fetchDoc, updateDoc } from '@/components/cms/api'
import { Sidebar, Icons, useAuthGuard } from '@/components/cms/shared'

const STATUS_COLORS: Record<string, string> = { new: 'var(--s-new)', contacted: 'var(--s-cont)', qualified: 'var(--s-qual)', proposal: 'var(--s-prop)', 'closed-won': 'var(--s-won)', 'closed-lost': 'var(--s-lost)' }
const STATUS_BG: Record<string, string> = { new: 'var(--s-new-bg)', contacted: 'var(--s-cont-bg)', qualified: 'var(--s-qual-bg)', proposal: 'var(--s-prop-bg)', 'closed-won': 'var(--s-won-bg)', 'closed-lost': 'var(--s-lost-bg)' }
const STATUS_LABELS: Record<string, string> = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', proposal: 'Proposal', 'closed-won': 'Closed Won', 'closed-lost': 'Closed Lost' }

export default function LeadDetail() {
  useAuthGuard()
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Record<string, string>>({})
  const [status, setStatus] = useState('')
  const [utmOpen, setUtmOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchDoc('leads', params.id as string).then(d => { setLead(d); setStatus(d.status || 'new') })
  }, [params.id])

  async function save() {
    setSaving(true)
    await updateDoc('leads', params.id as string, { ...lead, status })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function set(k: string, v: string) { setLead(l => ({ ...l, [k]: v })) }

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <div className="main-top">
          <div className="mt-l">
            <div className="flex aic gap8 muted" style={{ fontSize: 13, marginBottom: 8 }}>
              <Link href="/cms/leads" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Leads</Link>
              <span style={{ display: 'grid', width: 14 }}>{Icons.chevRight}</span>
              <span style={{ color: 'var(--fg)' }}>{lead.name || '…'}</span>
            </div>
            <h3>{lead.name || 'Loading…'}</h3>
            <p>Created {lead.createdAt ? new Date(lead.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</p>
          </div>
          <div className="main-tools">
            <button className="btn btn-ghost" onClick={() => router.push('/cms/leads')}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saved ? <>{Icons.check} Saved</> : saving ? 'Saving…' : <>{Icons.check} Save changes</>}
            </button>
          </div>
        </div>

        <div className="detail-grid">
          <div className="card card-pad">
            <div className="field-row">
              <div className="field"><label>Full name</label><input className="input" value={lead.name || ''} onChange={e => set('name', e.target.value)} /></div>
              <div className="field"><label>Email address</label><input className="input" type="email" value={lead.email || ''} onChange={e => set('email', e.target.value)} /></div>
            </div>
            <div className="field"><label>Website</label><input className="input" value={lead.website || ''} onChange={e => set('website', e.target.value)} placeholder="yourstore.com" /></div>
            <div className="field-row">
              <div className="field"><label>Goal</label>
                <select className="select" value={lead.goal || ''} onChange={e => set('goal', e.target.value)}>
                  <option value="">— Select —</option>
                  {['SEO & visibility','Store design / build','Migration to Shopify','Conversion (CRO)','Headless / Plus','Not sure yet'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field"><label>Stage</label>
                <select className="select" value={lead.stage || ''} onChange={e => set('stage', e.target.value)}>
                  {['Pre-launch','Live, under $50k/mo','$50k–250k/mo','$250k+/mo'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field"><label>Budget</label><input className="input" value={lead.budget || ''} onChange={e => set('budget', e.target.value)} placeholder="e.g. $5k / mo" /></div>
              <div className="field"><label>Source page</label><input className="input" value={lead.sourcePage || ''} onChange={e => set('sourcePage', e.target.value)} /></div>
            </div>

            <div className={'collapse-h' + (utmOpen ? ' open' : '')} onClick={() => setUtmOpen(!utmOpen)}>
              <span>UTM &amp; attribution</span>{Icons.chevDown}
            </div>
            {utmOpen && (
              <div style={{ paddingTop: 16 }}>
                <div className="field-row">
                  <div className="field"><label>UTM source</label><input className="input" value={lead.utmSource || ''} onChange={e => set('utmSource', e.target.value)} /></div>
                  <div className="field"><label>UTM medium</label><input className="input" value={lead.utmMedium || ''} onChange={e => set('utmMedium', e.target.value)} /></div>
                </div>
                <div className="field"><label>UTM campaign</label><input className="input" value={lead.utmCampaign || ''} onChange={e => set('utmCampaign', e.target.value)} /></div>
              </div>
            )}

            <div className="field" style={{ marginBottom: 0, marginTop: 18 }}>
              <label>Notes</label>
              <textarea className="textarea" value={lead.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Internal notes about this lead…" />
            </div>
          </div>

          <div className="flex" style={{ flexDirection: 'column', gap: 18 }}>
            <div className="status-card">
              <div className="sc-l">Current status</div>
              <div className="bigbadge" style={{ color: STATUS_COLORS[status], background: STATUS_BG[status] }}>
                {STATUS_LABELS[status] || status}
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 12.5, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Change status</label>
                <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="status-card">
              <div className="sc-l" style={{ marginBottom: 14 }}>Quick actions</div>
              <div className="qa">
                <button className="qa-btn" onClick={() => { if (lead.email) window.open(`mailto:${lead.email}`, '_blank') }}>
                  {Icons.send} Send follow-up email
                </button>
                <button className="qa-btn" onClick={() => { navigator.clipboard.writeText(lead.email || '') }}>
                  {Icons.copy} Copy email address
                </button>
                {lead.website && (
                  <button className="qa-btn" onClick={() => window.open(`https://${lead.website}`, '_blank')}>
                    {Icons.external} View website
                  </button>
                )}
                {lead.sourcePage && (
                  <button className="qa-btn" onClick={() => window.open(`https://agentixmarketing.com${lead.sourcePage}`, '_blank')}>
                    {Icons.external} View source page
                  </button>
                )}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                <div className="flex between"><span>Lead ID</span><span className="td-mono">#{lead.id}</span></div>
                <div className="flex between"><span>Created</span><span className="td-mono">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB') : '—'}</span></div>
                <div className="flex between"><span>Updated</span><span className="td-mono">{lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString('en-GB') : '—'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

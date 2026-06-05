'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchCollection, updateDoc } from '@/components/cms/api'
import { Sidebar, Icons, StatusBadge, StatusDropdown, SkeletonRows, useAuthGuard } from '@/components/cms/shared'

interface Lead { id: number; name: string; email: string; goal: string; status: string; stage: string; sourcePage: string; createdAt: string }
interface Contact { id: number; name: string; email: string; need: string; message: string; createdAt: string }

const FUNNEL_STAGES = [
  { stage: 'New', key: 'new', color: 'blue' },
  { stage: 'Contacted', key: 'contacted', color: 'amber' },
  { stage: 'Qualified', key: 'qualified', color: 'green' },
  { stage: 'Proposal', key: 'proposal', color: 'violet' },
  { stage: 'Closed Won', key: 'closed-won', color: 'emerald' },
]

export default function Dashboard() {
  useAuthGuard()
  const [leads, setLeads] = useState<Lead[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [counts, setCounts] = useState({ leads: 0, contacts: 0, blog: 0, published: 0, drafts: 0 })
  const [loading, setLoading] = useState(true)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    async function load() {
      const [ld, ct, bp] = await Promise.all([
        fetchCollection('leads', { limit: 8, sort: '-createdAt' }),
        fetchCollection('contact-submissions', { limit: 4, sort: '-createdAt' }),
        fetchCollection('blog-posts', { limit: 0 }),
      ])
      setLeads(ld.docs || [])
      setContacts(ct.docs || [])
      const published = bp.docs?.filter((p: { status: string }) => p.status === 'published').length || 0
      setCounts({
        leads: ld.totalDocs || 0,
        contacts: ct.totalDocs || 0,
        blog: bp.totalDocs || 0,
        published,
        drafts: (bp.totalDocs || 0) - published,
      })
      setLoading(false)
      setTimeout(() => setDrawn(true), 200)
    }
    load()
  }, [])

  async function changeStatus(id: number, status: string) {
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l))
    await updateDoc('leads', id, { status })
  }

  const funnel = FUNNEL_STAGES.map(f => ({
    ...f,
    count: leads.filter(l => l.status === f.key).length,
  }))
  const funnelMax = Math.max(...funnel.map(f => f.count), 1)
  const qualifiedCount = leads.filter(l => l.status === 'qualified' || l.status === 'proposal').length
  const wonCount = leads.filter(l => l.status === 'closed-won').length
  const conversionPct = counts.leads > 0 ? ((wonCount / counts.leads) * 100).toFixed(1) : '0'

  const user = typeof window !== 'undefined' ? (() => { try { return JSON.parse(localStorage.getItem('cms-user') || '{}') } catch { return {} } })() : {}
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const sidebarCounts = { leads: counts.leads, contacts: counts.contacts, blog: counts.blog }

  return (
    <div className="app">
      <Sidebar counts={sidebarCounts} />
      <div className="main">
        <div className="main-top">
          <div className="mt-l">
            <h3>{greeting}{user.name ? `, ${user.name.split(' ')[0]}` : ''}</h3>
            <p>Here&apos;s what&apos;s happening across Agentix today.</p>
          </div>
          <div className="main-tools">
            <div className="search">{Icons.search}<input placeholder="Search leads, posts…" /></div>
            <Link href="/cms/leads" className="btn btn-primary">{Icons.leads} New Lead</Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="stat-row mb26">
          {[
            { ico: 'leads', n: String(counts.leads), label: 'Total Leads', sub: `${leads.filter(l=>l.status==='new').length} awaiting contact`, trend: { dir: 'up', v: '+' + leads.filter(l=>l.status==='new').length + ' new' } },
            { ico: 'trend', n: String(qualifiedCount), label: 'Qualified Leads', sub: 'ready for proposal', trend: { dir: 'up', v: `${wonCount} won` } },
            { ico: 'inbox', n: String(counts.contacts), label: 'Contact Submissions', sub: 'via contact form', trend: { dir: 'up', v: 'total' } },
            { ico: 'blog', n: String(counts.published), label: 'Posts Published', sub: `${counts.drafts} draft${counts.drafts !== 1 ? 's' : ''} pending`, trend: { dir: 'flat', v: `${counts.blog} total` } },
          ].map(s => (
            <div className="stat" key={s.label}>
              <div className="stat-top">
                <div className="stat-ico">{Icons[s.ico]}</div>
                <span className={'stat-trend ' + s.trend.dir}>{s.trend.dir === 'up' ? Icons.arrowUp : null}{s.trend.v}</span>
              </div>
              <div className="n">{s.n}</div>
              <div className="l">{s.label} · {s.sub}</div>
            </div>
          ))}
        </div>

        {/* Leads table + funnel */}
        <div className="grid-6040 mb26">
          <div>
            <div className="sec-h">
              <h4>Recent Leads</h4>
              <Link href="/cms/leads" className="sec-link">View all leads →</Link>
            </div>
            <div className="tbl-wrap">
              {loading ? <SkeletonRows /> : leads.length === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                  No leads yet — they&apos;ll appear here once someone submits the strategy form.
                </div>
              ) : (
                <table>
                  <thead><tr>
                    <th>Name</th><th>Goal</th><th>Status</th><th>Created</th><th></th>
                  </tr></thead>
                  <tbody>
                    {leads.map(l => (
                      <tr key={l.id}>
                        <td>
                          <Link href={`/cms/leads/${l.id}`} style={{ textDecoration: 'none' }}>
                            <div className="td-name">{l.name}</div>
                            <div className="td-sub">{l.email}</div>
                          </Link>
                        </td>
                        <td className="muted" style={{ fontSize: 13 }}>{l.goal || '—'}</td>
                        <td><StatusBadge status={l.status} /></td>
                        <td className="td-mono" style={{ fontSize: 12.5 }}>{new Date(l.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                        <td><div className="row-actions" style={{ opacity: 1 }}><StatusDropdown value={l.status} onChange={s => changeStatus(l.id, s)} /></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div>
            <div className="sec-h">
              <h4>Lead Funnel</h4>
              <span className="muted" style={{ fontSize: 12.5 }}>Current pipeline</span>
            </div>
            <div className="card card-pad">
              <div className="funnel">
                {funnel.map(f => (
                  <div className="fn-row" key={f.stage}>
                    <div className="fn-top">
                      <span className="fn-stage">{f.stage}</span>
                      <span className="fn-n">{f.count}</span>
                    </div>
                    <div className="fn-bar">
                      <div className={'fn-fill ' + f.color} style={{ width: drawn ? `${(f.count / funnelMax) * 100}%` : '0%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span className="muted">Conversion to Won</span>
                <span style={{ fontWeight: 500, color: 'var(--s-won)' }}>{conversionPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent contacts */}
        <div className="sec-h">
          <h4>Recent Contact Submissions</h4>
          <Link href="/cms/contacts" className="sec-link">View inbox →</Link>
        </div>
        <div className="card card-pad">
          {loading ? <SkeletonRows n={3} /> : contacts.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
              No contact submissions yet.
            </div>
          ) : contacts.map(c => (
            <div className="csub" key={c.id}>
              <div className="av">{c.name?.split(' ').map((x: string) => x[0]).slice(0, 2).join('')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex aic gap8 wrap-w">
                  <span className="cs-name">{c.name}</span>
                  <span className="cs-mail">{c.email}</span>
                  {c.need && <span className="pill tag">{c.need}</span>}
                </div>
                <div className="cs-msg">{c.message || '(no message)'}</div>
              </div>
              <span className="cs-time">{new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

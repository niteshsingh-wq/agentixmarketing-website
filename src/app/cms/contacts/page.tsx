'use client'
import { useEffect, useState } from 'react'
import { fetchCollection, deleteDoc } from '@/components/cms/api'
import { Sidebar, Icons, useAuthGuard, PageHeader, EmptyState, SearchBar } from '@/components/cms/shared'

interface Contact { id: number; name: string; email: string; website: string; need: string; message: string; createdAt: string }

const NEED_OPTS = ['All', 'Shopify Development', 'SEO & Marketing', 'Shopify + SEO', 'Not sure yet']
const NEED_HUE: Record<string, number> = { 'Shopify Development': 28, 'SEO & Marketing': 198, 'Shopify + SEO': 268, 'Not sure yet': 0 }

function timeGroup(dateStr: string) {
  const d = new Date(dateStr), now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  if (diffDays < 1) return 'Today'
  if (diffDays < 7) return 'This Week'
  return 'Earlier'
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr), now = new Date()
  const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays < 1) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' today'
  if (diffDays < 7) return d.toLocaleDateString('en-GB', { weekday: 'short' }) + ', ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function ContactsPage() {
  useAuthGuard()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchCollection('contact-submissions', { limit: 100, sort: '-createdAt' }).then(d => {
      setContacts(d.docs || [])
      setTotal(d.totalDocs || 0)
      setLoading(false)
    })
  }, [])

  async function archive(id: number) {
    if (!confirm('Archive this submission?')) return
    await deleteDoc('contact-submissions', id)
    setContacts(cs => cs.filter(c => c.id !== id))
    setTotal(t => t - 1)
  }

  const shown = contacts.filter(c => {
    const matchFilter = filter === 'All' || c.need === filter
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const groups = ['Today', 'This Week', 'Earlier']
  const today = contacts.filter(c => timeGroup(c.createdAt) === 'Today').length
  const thisWeek = contacts.filter(c => timeGroup(c.createdAt) === 'This Week').length

  return (
    <div className="app">
      <Sidebar counts={{ contacts: total }} />
      <div className="main">
        <PageHeader title="Contact Submissions" sub={`${total} total · ${today} today · ${thisWeek} this week`}>
          <SearchBar placeholder="Search submissions…" value={search} onChange={setSearch} />
        </PageHeader>

        <div className="filterbar">
          <div className="fseg">
            {NEED_OPTS.map(n => <button key={n} className={filter === n ? 'on' : ''} onClick={() => setFilter(n)}>{n}</button>)}
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 20 }}><div className="card card-pad"><div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div></div></div>
        ) : shown.length === 0 ? (
          <EmptyState title="No submissions yet" desc="Contact form submissions will appear here once visitors reach out." />
        ) : (
          groups.map(g => {
            const items = shown.filter(c => timeGroup(c.createdAt) === g)
            if (!items.length) return null
            return (
              <div key={g}>
                <div className="cgroup-h">{g} · {items.length}</div>
                {items.map(c => {
                  const h = NEED_HUE[c.need] ?? 198
                  return (
                    <div className="ccard" key={c.id}>
                      <div className="ccard-top">
                        <div className="cc-av">{c.name?.split(' ').map((x: string) => x[0]).slice(0, 2).join('') || '?'}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="cc-name">{c.name}</div>
                          <div className="cc-meta">
                            <a href={`mailto:${c.email}`}>{c.email}</a>
                            {c.website && <><span>·</span><a href={`https://${c.website}`} target="_blank" rel="noreferrer" className="td-link">{c.website}</a></>}
                          </div>
                        </div>
                        {c.need && (
                          <span className="pill tag" style={c.need === 'Not sure yet' ? { color: 'var(--muted)', background: 'rgba(255,255,255,0.06)' } : { color: `hsl(${h} 80% 68%)`, background: `hsl(${h} 70% 50% / 0.13)` }}>
                            {c.need}
                          </span>
                        )}
                      </div>
                      <div className="cc-msg">{c.message || '(no message)'}</div>
                      <div className="cc-foot">
                        <a href={`mailto:${c.email}`} className="btn btn-sm btn-primary">{Icons.mail} Reply via Email</a>
                        <button className="btn btn-sm btn-ghost" onClick={() => archive(c.id)}>{Icons.archive} Archive</button>
                        <span className="cc-time">{formatTime(c.createdAt)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchCollection, updateDoc, deleteDoc } from '@/components/cms/api'
import { Sidebar, Icons, StatusBadge, StatusDropdown, SkeletonRows, useAuthGuard, PageHeader, EmptyState, SearchBar } from '@/components/cms/shared'

interface Lead { id: number; name: string; email: string; website: string; goal: string; stage: string; budget: string; status: string; sourcePage: string; createdAt: string }

const STATUSES = ['All', 'new', 'contacted', 'qualified', 'proposal', 'closed-won', 'closed-lost']
const STATUS_LABELS: Record<string, string> = { 'All': 'All', 'new': 'New', 'contacted': 'Contacted', 'qualified': 'Qualified', 'proposal': 'Proposal', 'closed-won': 'Closed Won', 'closed-lost': 'Closed Lost' }

export default function LeadsPage() {
  useAuthGuard()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number[]>([])
  const [total, setTotal] = useState(0)

  async function load() {
    setLoading(true)
    const data = await fetchCollection('leads', { limit: 100, sort: '-createdAt' })
    setLeads(data.docs || [])
    setTotal(data.totalDocs || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const shown = leads.filter(l => {
    const matchFilter = filter === 'All' || l.status === filter
    const matchSearch = !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase()) || l.website?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  function toggle(id: number) { setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]) }
  function toggleAll() { setSelected(selected.length === shown.length ? [] : shown.map(l => l.id)) }

  async function bulkStatus(status: string) {
    await Promise.all(selected.map(id => updateDoc('leads', id, { status })))
    setLeads(ls => ls.map(l => selected.includes(l.id) ? { ...l, status } : l))
    setSelected([])
  }

  async function changeStatus(id: number, status: string) {
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l))
    await updateDoc('leads', id, { status })
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this lead?')) return
    await deleteDoc('leads', id)
    setLeads(ls => ls.filter(l => l.id !== id))
    setTotal(t => t - 1)
  }

  const newCount = leads.filter(l => l.status === 'new').length

  return (
    <div className="app">
      <Sidebar counts={{ leads: total }} />
      <div className="main">
        <PageHeader title="Leads" sub={`${total} total · ${newCount} awaiting first contact`}>
          <SearchBar placeholder="Search by name, email, website…" value={search} onChange={setSearch} />
          <button className="btn btn-ghost" onClick={() => {
            const csv = [['Name','Email','Website','Goal','Stage','Budget','Status','Source','Created'],
              ...leads.map(l => [l.name,l.email,l.website,l.goal,l.stage,l.budget,l.status,l.sourcePage,l.createdAt])
            ].map(r => r.join(',')).join('\n')
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'agentix-leads.csv'; a.click()
          }}>{Icons.external} Export CSV</button>
        </PageHeader>

        <div className="filterbar" style={{ position: 'sticky', top: 0, background: 'var(--ink)', zIndex: 20 }}>
          <div className="fseg">
            {STATUSES.map(s => (
              <button key={s} className={filter === s ? 'on' : ''} onClick={() => { setFilter(s); setSelected([]) }}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {selected.length > 0 && (
          <div className="bulkbar">
            <span className="bb-count">{selected.length} selected</span>
            <div className="bb-actions">
              <button className="btn btn-sm btn-soft" onClick={() => bulkStatus('contacted')}>Mark as Contacted</button>
              <button className="btn btn-sm btn-soft" onClick={() => bulkStatus('qualified')}>Mark as Qualified</button>
              <button className="btn btn-sm btn-danger" onClick={async () => { if (confirm(`Delete ${selected.length} leads?`)) { await Promise.all(selected.map(id => deleteDoc('leads', id))); setLeads(ls => ls.filter(l => !selected.includes(l.id))); setSelected([]) } }}>{Icons.trash} Delete</button>
            </div>
          </div>
        )}

        <div className="tbl-wrap">
          {loading ? <SkeletonRows n={8} /> : shown.length === 0 ? (
            <EmptyState
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{width:70,height:70,color:'var(--line)',marginBottom:20}}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              title={filter === 'All' ? 'No leads yet' : `No ${STATUS_LABELS[filter]} leads`}
              desc="They'll appear here the moment someone submits the strategy form on agentixmarketing.com."
              action={<Link href="/" className="btn btn-ghost" style={{ margin: '0 auto' }}>{Icons.external} View site</Link>}
            />
          ) : (
            <table>
              <thead><tr>
                <th style={{ width: 38 }}>
                  <div className={'checkbox' + (selected.length === shown.length && shown.length ? ' on' : '')} onClick={toggleAll}>{Icons.check}</div>
                </th>
                <th>Name / Email</th><th>Website</th><th>Goal</th><th>Budget</th><th>Status</th><th>Created</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr></thead>
              <tbody>
                {shown.map(l => (
                  <tr key={l.id} style={selected.includes(l.id) ? { background: 'var(--blue-soft)' } : undefined}>
                    <td><div className={'checkbox' + (selected.includes(l.id) ? ' on' : '')} onClick={() => toggle(l.id)}>{Icons.check}</div></td>
                    <td>
                      <Link href={`/cms/leads/${l.id}`} style={{ textDecoration: 'none' }}>
                        <div className="td-name">{l.name}</div>
                        <div className="td-sub">{l.email}</div>
                      </Link>
                    </td>
                    <td>{l.website ? <span className="td-link">{l.website}</span> : <span className="muted">—</span>}</td>
                    <td>{l.goal ? <span className="pill">{l.goal}</span> : <span className="muted">—</span>}</td>
                    <td className="td-mono">{l.budget || '—'}</td>
                    <td><StatusBadge status={l.status} /></td>
                    <td className="td-mono" style={{ fontSize: 12.5 }}>{new Date(l.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <div className="row-actions">
                        <Link href={`/cms/leads/${l.id}`} className="icon-btn" title="Edit">{Icons.edit}</Link>
                        <StatusDropdown value={l.status} onChange={s => changeStatus(l.id, s)} />
                        <button className="icon-btn" title="Delete" onClick={() => handleDelete(l.id)}>{Icons.trash}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="pager">
          <span className="pg-info">Showing {shown.length} of {total} leads</span>
          <div className="pg-btns">
            <button className="pg-btn">←</button>
            <button className="pg-btn on">1</button>
            <button className="pg-btn">→</button>
          </div>
        </div>
      </div>
    </div>
  )
}

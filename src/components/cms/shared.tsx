'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { logout, getCurrentUser } from './api'

/* ─── Icons ─── */
function Ic({ children, fill }: { children: React.ReactNode; fill?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'}
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

export const Icons: Record<string, React.ReactNode> = {
  dashboard: <Ic><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></Ic>,
  leads: <Ic><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Ic>,
  contacts: <Ic><path d="M4 4h16v16H4z"/><path d="M16 2v4M8 2v4M4 10h16"/></Ic>,
  blog: <Ic><path d="M4 4h12l4 4v12H4z"/><path d="M14 4v4h4"/><path d="M8 13h8M8 17h6"/></Ic>,
  testimonial: <Ic><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.8-5.9A8.5 8.5 0 1 1 21 11.5z"/></Ic>,
  service: <Ic><path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.8 6.2 16.6l.9-5.3L3.3 7.6l5.3-.8z"/></Ic>,
  casestudy: <Ic><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 5-6"/></Ic>,
  media: <Ic><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></Ic>,
  settings: <Ic><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Ic>,
  users: <Ic><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Ic>,
  search: <Ic><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Ic>,
  plus: <Ic><path d="M12 5v14M5 12h14"/></Ic>,
  chevDown: <Ic><path d="M6 9l6 6 6-6"/></Ic>,
  chevRight: <Ic><path d="M9 6l6 6-6 6"/></Ic>,
  arrowUp: <Ic><path d="M12 19V5M5 12l7-7 7 7"/></Ic>,
  arrowUpRight: <Ic><path d="M7 17L17 7M7 7h10v10"/></Ic>,
  trend: <Ic><path d="M3 17l6-6 4 4 7-7"/><path d="M17 8h4v4"/></Ic>,
  check: <Ic><path d="M20 6L9 17l-5-5"/></Ic>,
  edit: <Ic><path d="M11 4H4v16h16v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></Ic>,
  trash: <Ic><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></Ic>,
  more: <Ic><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></Ic>,
  mail: <Ic><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></Ic>,
  copy: <Ic><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></Ic>,
  external: <Ic><path d="M14 4h6v6M20 4l-9 9M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></Ic>,
  filter: <Ic><path d="M3 5h18l-7 8v6l-4-2v-4z"/></Ic>,
  calendar: <Ic><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Ic>,
  archive: <Ic><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/></Ic>,
  upload: <Ic><path d="M12 16V4M6 10l6-6 6 6"/><path d="M4 20h16"/></Ic>,
  inbox: <Ic><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5 6l-3 6v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3-6z"/></Ic>,
  bold: <Ic><path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z"/></Ic>,
  italic: <Ic><path d="M19 4h-9M14 20H5M15 4L9 20"/></Ic>,
  quote: <Ic><path d="M3 7h6v6c0 3-2 5-5 5M15 7h6v6c0 3-2 5-5 5"/></Ic>,
  code: <Ic><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></Ic>,
  link: <Ic><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></Ic>,
  image: <Ic><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></Ic>,
  list: <Ic><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></Ic>,
  clock: <Ic><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></Ic>,
  send: <Ic><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></Ic>,
  file: <Ic><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></Ic>,
  db: <Ic><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></Ic>,
  lock: <Ic><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></Ic>,
  logout: <Ic><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></Ic>,
}

/* ─── Nav config ─── */
const NAV_GROUPS = [
  { grp: 'Pipeline', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/cms' },
    { id: 'leads', label: 'Leads', icon: 'leads', href: '/cms/leads' },
    { id: 'contacts', label: 'Contacts', icon: 'contacts', href: '/cms/contacts' },
  ]},
  { grp: 'Content', items: [
    { id: 'blog', label: 'Blog Posts', icon: 'blog', href: '/cms/blog' },
    { id: 'media', label: 'Media', icon: 'media', href: '/cms/media' },
  ]},
  { grp: 'Settings', items: [
    { id: 'settings', label: 'Settings', icon: 'settings', href: '/cms/settings' },
  ]},
]

/* ─── Sidebar ─── */
export function Sidebar({ counts = {} }: { counts?: Record<string, number> }) {
  const pathname = usePathname()
  const router = useRouter()
  // Read localStorage only client-side to avoid hydration mismatch
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null)
  useEffect(() => { setUser(getCurrentUser()) }, [])

  const active = pathname === '/cms' ? 'dashboard'
    : pathname.startsWith('/cms/leads') ? 'leads'
    : pathname.startsWith('/cms/contacts') ? 'contacts'
    : pathname.startsWith('/cms/blog') ? 'blog'
    : pathname.startsWith('/cms/media') ? 'media'
    : pathname.startsWith('/cms/settings') ? 'settings'
    : 'dashboard'

  function handleLogout() {
    logout()
    router.push('/admin/login')
  }

  return (
    <aside className="side">
      <div className="side-brand">
        <img src="/agentix-logo.png" alt="Agentix Marketing" style={{ width: 28, height: 28, objectFit: 'contain', flexShrink: 0 }} />
        <div className="side-word">Agentix<small>CMS</small></div>
      </div>

      {NAV_GROUPS.map(g => (
        <div className="side-grp" key={g.grp}>
          <h6>{g.grp}</h6>
          {g.items.map(it => (
            <Link href={it.href} key={it.id} className={'nav-i' + (active === it.id ? ' on' : '')}>
              <span style={{ display: 'grid', placeItems: 'center', width: 17, height: 17 }}>{Icons[it.icon]}</span>
              <span className="lbl">{it.label}</span>
              {counts[it.id] != null && <span className="cnt">{counts[it.id]}</span>}
            </Link>
          ))}
        </div>
      ))}

      <div className="side-foot">
        <div className="side-avatar">{user?.name?.slice(0, 2)?.toUpperCase() || 'AU'}</div>
        <div className="u-meta">
          <div className="u-name">{user?.name || 'Admin'}</div>
          <div className="u-mail">{user?.role || 'admin'}</div>
        </div>
        <button onClick={handleLogout} className="u-cog" style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          title="Log out">
          <span style={{ display: 'grid', placeItems: 'center', width: 17, height: 17 }}>{Icons.logout}</span>
        </button>
      </div>
    </aside>
  )
}

/* ─── Status badge ─── */
const STATUS_CLASS: Record<string, string> = {
  new: 'new', contacted: 'contacted', qualified: 'qualified',
  proposal: 'proposal', 'closed-won': 'won', 'closed-lost': 'lost',
}

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_CLASS[status?.toLowerCase()] || STATUS_CLASS[status] || 'new'
  return <span className={'badge ' + cls}>{status}</span>
}

/* ─── Status dropdown ─── */
const STATUS_OPTS = ['new', 'contacted', 'qualified', 'proposal', 'closed-won', 'closed-lost']
const STATUS_COLORS: Record<string, string> = {
  new: '#38b6ff', contacted: '#f5b53d', qualified: '#3ddc84',
  proposal: '#9d7bff', 'closed-won': '#2ecf7f', 'closed-lost': 'rgba(244,245,247,0.5)',
}
const STATUS_LABELS: Record<string, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified',
  proposal: 'Proposal', 'closed-won': 'Closed Won', 'closed-lost': 'Closed Lost',
}

export function StatusDropdown({ value, onChange }: { value: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="dd" ref={ref}>
      <button className="icon-btn" onClick={() => setOpen(!open)} title="Change status">
        {Icons.chevDown}
      </button>
      {open && (
        <div className="dd-menu">
          {STATUS_OPTS.map(o => (
            <div className="dd-item" key={o} onClick={() => { onChange(o); setOpen(false) }}>
              <span className="sw" style={{ background: STATUS_COLORS[o] }}></span>
              {STATUS_LABELS[o]}
              {value?.toLowerCase() === o && <span style={{ marginLeft: 'auto', color: 'var(--blue)', display: 'grid', placeItems: 'center', width: 14 }}>{Icons.check}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Skeleton row ─── */
export function SkeletonRows({ n = 5 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="skel-row">
          <div className="skel" style={{ width: 38, height: 38, borderRadius: '50%' }}></div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div className="skel" style={{ width: `${60 + i * 8}%`, height: 14 }}></div>
            <div className="skel" style={{ width: '40%', height: 11 }}></div>
          </div>
          <div className="skel" style={{ width: 72, height: 24, borderRadius: 100 }}></div>
        </div>
      ))}
    </>
  )
}

/* ─── Auth guard hook ─── */
export function useAuthGuard() {
  const router = useRouter()
  useEffect(() => {
    if (!localStorage.getItem('cms-token')) {
      router.replace('/admin/login?redirect=/cms')
    }
  }, [router])
}

/* ─── Page header ─── */
export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="main-top">
      <div className="mt-l">
        <h3>{title}</h3>
        {sub && <p>{sub}</p>}
      </div>
      {children && <div className="main-tools">{children}</div>}
    </div>
  )
}

/* ─── Empty state ─── */
export function EmptyState({ icon, title, desc, action }: { icon?: React.ReactNode; title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="empty">
      {icon || <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M4 4h16v16H4z"/><path d="M8 12h8M8 8h8M8 16h5"/></svg>}
      <h4>{title}</h4>
      <p>{desc}</p>
      {action}
    </div>
  )
}

/* ─── Search bar ─── */
export function SearchBar({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="search">
      {Icons.search}
      <input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

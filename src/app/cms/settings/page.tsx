'use client'
import { useEffect, useState } from 'react'
import { fetchCollection } from '@/components/cms/api'
import { Sidebar, Icons, useAuthGuard, PageHeader } from '@/components/cms/shared'

interface User { id: number; name: string; email: string; role: string; updatedAt: string }

export default function SettingsPage() {
  useAuthGuard()
  const [users, setUsers] = useState<User[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')

  useEffect(() => {
    fetchCollection('users', { limit: 20 }).then(d => setUsers(d.docs || []))
  }, [])

  function timeAgo(dateStr: string) {
    const d = new Date(dateStr), now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 2) return 'Active now'
    if (mins < 60) return `${mins} minutes ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPwd !== confirmPwd) { setPwdMsg('Passwords do not match'); return }
    if (newPwd.length < 8) { setPwdMsg('Password must be at least 8 characters'); return }
    const token = localStorage.getItem('cms-token')
    const userData = JSON.parse(localStorage.getItem('cms-user') || '{}')
    const res = await fetch(`/api/users/${userData.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
      body: JSON.stringify({ password: newPwd }),
    })
    if (res.ok) { setPwdMsg('Password updated successfully'); setCurrentPwd(''); setNewPwd(''); setConfirmPwd('') }
    else setPwdMsg('Failed to update password. Check your current credentials.')
  }

  const currentUser = typeof window !== 'undefined' ? (() => { try { return JSON.parse(localStorage.getItem('cms-user') || '{}') } catch { return {} } })() : {}

  return (
    <div className="app tall">
      <Sidebar />
      <div className="main">
        <PageHeader title="Settings" sub="Team, security and integrations">
          <button className="btn btn-primary" onClick={() => setShowInvite(true)}>{Icons.plus} Invite user</button>
        </PageHeader>

        <div style={{ maxWidth: 760 }}>
          {/* Team */}
          <div className="setting-sec">
            <h4>Team</h4>
            <div className="ss-sub">{users.length} member{users.length !== 1 ? 's' : ''} have access to the Agentix CMS.</div>
            <div className="flex" style={{ flexDirection: 'column', gap: 12 }}>
              {users.map(u => (
                <div className="user-card" key={u.email}>
                  <div className="uc-av">{u.name?.slice(0, 2)?.toUpperCase() || u.email?.slice(0, 2)?.toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="uc-name">
                      {u.name || u.email}
                      {u.id === currentUser.id && <span className="you-tag">You</span>}
                    </div>
                    <div className="uc-mail">{u.email}</div>
                  </div>
                  <span className={'role-badge ' + (u.role === 'admin' ? 'admin' : 'editor')}>{u.role}</span>
                  <span className="uc-active">{timeAgo(u.updatedAt)}</span>
                  <button className="icon-btn">{Icons.more}</button>
                </div>
              ))}
              {users.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading team…</div>}
            </div>
          </div>

          {/* Security */}
          <div className="setting-sec">
            <h4>Security</h4>
            <div className="ss-sub">Update the password for your admin account.</div>
            <div className="card card-pad">
              <form onSubmit={changePassword}>
                <div className="field"><label>Current password</label><input className="input" type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Enter current password" /></div>
                <div className="field-row">
                  <div className="field"><label>New password</label><input className="input" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Min 8 characters" /></div>
                  <div className="field"><label>Confirm new password</label><input className="input" type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Re-enter new password" /></div>
                </div>
                {pwdMsg && <p style={{ fontSize: 13, color: pwdMsg.includes('successfully') ? 'var(--s-qual)' : '#ff6b6b', marginBottom: 12 }}>{pwdMsg}</p>}
                <div className="flex" style={{ justifyContent: 'flex-end', gap: 10 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => { setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); setPwdMsg('') }}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{Icons.lock} Update password</button>
                </div>
              </form>
            </div>
          </div>

          {/* Integrations */}
          <div className="setting-sec">
            <h4>Integrations</h4>
            <div className="ss-sub">Connected services powering the Agentix backend.</div>
            <div className="flex" style={{ flexDirection: 'column', gap: 12 }}>
              {[
                { icon: 'B', iconColor: '#0a9d6e', name: 'Brevo SMTP', sub: 'smtp-relay.brevo.com · transactional & follow-up email', connected: !!process.env.BREVO_USER || true },
                { icon: Icons.db, iconColor: 'var(--blue)', name: 'PostgreSQL Database', sub: 'localhost:5432/agentix · primary datastore', connected: true },
                { icon: Icons.image, iconColor: 'var(--muted)', name: 'Cloudinary CDN', sub: 'Media delivery & transforms · not configured', connected: false },
              ].map((item, i) => (
                <div className="integ" key={i}>
                  <div className="ig-ico" style={{ color: item.iconColor }}>{typeof item.icon === 'string' ? item.icon : item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="ig-name">{item.name}</div>
                    <div className="ig-sub">{item.sub}</div>
                  </div>
                  <span className={'conn ' + (item.connected ? 'on' : 'off')}>{item.connected ? 'Connected' : 'Disconnected'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payload admin link */}
          <div className="setting-sec">
            <h4>Advanced</h4>
            <div className="ss-sub">For full data management and schema control.</div>
            <div className="card card-pad" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>Payload CMS Admin</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Full-featured admin panel for all collections, media uploads and user management.</div>
              </div>
              <a href="/admin" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">{Icons.external} Open Admin</a>
            </div>
          </div>
        </div>
      </div>

      {showInvite && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,6,0.7)', backdropFilter: 'blur(6px)', display: 'grid', placeItems: 'center', zIndex: 100 }} onClick={() => setShowInvite(false)}>
          <div className="card card-pad" style={{ width: 420, background: 'var(--ink-2)', maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h4 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em' }}>Invite a team member</h4>
            <p className="muted" style={{ fontSize: 13.5, marginTop: 6, marginBottom: 20 }}>New users can be added directly in the Payload admin.</p>
            <div className="field"><label>Email address</label><input className="input" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="name@agentixmarketing.com" /></div>
            <div className="field"><label>Role</label><select className="select" value={inviteRole} onChange={e => setInviteRole(e.target.value)}><option value="editor">Editor</option><option value="admin">Admin</option></select></div>
            <div className="flex" style={{ justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button className="btn btn-ghost" onClick={() => setShowInvite(false)}>Cancel</button>
              <a href="/admin/collections/users/create" target="_blank" className="btn btn-primary">{Icons.send} Create in Admin</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

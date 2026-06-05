'use client'
import { useEffect, useRef, useState } from 'react'
import { Sidebar, Icons, useAuthGuard, PageHeader } from '@/components/cms/shared'

interface MediaItem { id: number; url: string; filename: string; filesize: number; width?: number; height?: number; alt: string; mimeType: string; createdAt: string }

function formatBytes(b: number) {
  if (!b) return '—'
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' KB'
  return (b / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function MediaPage() {
  useAuthGuard()
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<number[]>([])
  const [filter, setFilter] = useState('Images')
  const [total, setTotal] = useState(0)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const token = localStorage.getItem('cms-token')
    const res = await fetch('/api/media?limit=100&sort=-createdAt', { headers: token ? { Authorization: `JWT ${token}` } : {} })
    const data = await res.json()
    setItems(data.docs || [])
    setTotal(data.totalDocs || 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function upload(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    const token = localStorage.getItem('cms-token')
    for (const file of Array.from(files)) {
      const form = new FormData()
      form.append('file', file)
      form.append('alt', file.name.replace(/\.[^.]+$/, ''))
      await fetch('/api/media', { method: 'POST', headers: token ? { Authorization: `JWT ${token}` } : {}, body: form })
    }
    await load()
    setUploading(false)
  }

  async function deleteSelected() {
    if (!confirm(`Delete ${selected.length} file(s)?`)) return
    const token = localStorage.getItem('cms-token')
    await Promise.all(selected.map(id => fetch(`/api/media/${id}`, { method: 'DELETE', headers: token ? { Authorization: `JWT ${token}` } : {} })))
    setItems(is => is.filter(i => !selected.includes(i.id)))
    setSelected([])
    setTotal(t => t - selected.length)
  }

  const isImage = (m: MediaItem) => m.mimeType?.startsWith('image/')
  const shown = filter === 'Images' ? items.filter(isImage) : items
  const toggle = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const hues = [198, 28, 152, 36, 210, 320, 24, 268]

  return (
    <div className="app tall">
      <Sidebar counts={{ media: total }} />
      <div className="main">
        <PageHeader title="Media Library" sub={`${total} files`}>
          <div className="search">{Icons.search}<input placeholder="Search files…" /></div>
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>{uploading ? 'Uploading…' : <>{Icons.upload} Upload</>}</button>
          <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: 'none' }} onChange={e => upload(e.target.files)} />
        </PageHeader>

        <div className="upload mb20" style={{ padding: 30 }} onClick={() => fileRef.current?.click()}
          onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); upload(e.dataTransfer.files) }}>
          <div style={{ display: 'grid', placeItems: 'center' }}>{Icons.upload}</div>
          <div className="up-t">Drag &amp; drop files here, or click to browse</div>
          <div className="up-s">PNG, JPG, WebP, SVG · up to 20 MB each</div>
        </div>

        <div className="filterbar">
          <div className="fseg">{['Images', 'All files'].map(f => <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>
          <span className="muted" style={{ fontSize: 12.5, marginLeft: 4 }}>{shown.length} items</span>
        </div>

        {selected.length > 0 && (
          <div className="bulkbar">
            <span className="bb-count">{selected.length} selected</span>
            <div className="bb-actions">
              {selected.length === 1 && (
                <button className="btn btn-sm btn-soft" onClick={() => { const item = items.find(i => i.id === selected[0]); if (item) navigator.clipboard.writeText(`/api/media/file/${item.filename}`) }}>{Icons.copy} Copy URL</button>
              )}
              <button className="btn btn-sm btn-danger" onClick={deleteSelected}>{Icons.trash} Delete</button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ color: 'var(--muted)', padding: 20 }}>Loading media…</div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--muted)' }}>
            <div style={{ marginBottom: 12 }}>{Icons.image}</div>
            <div style={{ fontWeight: 500 }}>No media yet</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Upload images to use them across the site.</div>
          </div>
        ) : (
          <div className="media-grid">
            {shown.map((m, idx) => {
              const on = selected.includes(m.id)
              const h = hues[idx % hues.length]
              return (
                <div key={m.id} className="masset" onClick={() => toggle(m.id)} style={on ? { borderColor: 'var(--blue)' } : undefined}>
                  <div className="thumb" style={{ background: m.url ? undefined : `linear-gradient(135deg, hsl(${h} 60% 24%), hsl(${h} 55% 12%))` }}>
                    {m.url ? (
                      <img src={m.url} alt={m.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: `hsl(${h} 70% 72%)`, display: 'grid', placeItems: 'center', width: 30 }}>{Icons.image}</span>
                    )}
                    <div className={'m-check' + (on ? ' on' : '')}>
                      <div className={'checkbox' + (on ? ' on' : '')} style={{ background: on ? 'var(--blue)' : 'rgba(10,10,11,0.7)', borderColor: on ? 'var(--blue)' : 'rgba(255,255,255,0.4)' }}>{Icons.check}</div>
                    </div>
                  </div>
                  <div className="m-meta">
                    <div className="m-name">{m.filename || m.alt}</div>
                    <div className="m-sub">
                      <span>{m.width && m.height ? `${m.width}×${m.height}` : m.mimeType?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                      <span>{formatBytes(m.filesize)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

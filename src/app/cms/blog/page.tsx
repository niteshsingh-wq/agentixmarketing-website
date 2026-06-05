'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchCollection, updateDoc, deleteDoc } from '@/components/cms/api'
import { Sidebar, Icons, useAuthGuard, PageHeader, EmptyState, SearchBar } from '@/components/cms/shared'

interface Post { id: number; title: string; slug: string; tag: string; status: string; readTime: string; publishedDate: string; excerpt: string; createdAt: string }

const TAG_HUE: Record<string, number> = { SEO: 198, Performance: 268, Migration: 152, 'Technical SEO': 210, 'Shopify Dev': 28, CRO: 36, Content: 320, Retention: 16 }

export default function BlogPage() {
  useAuthGuard()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('All')
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchCollection('blog-posts', { limit: 100, sort: '-createdAt' }).then(d => {
      setPosts(d.docs || [])
      setTotal(d.totalDocs || 0)
      setLoading(false)
    })
  }, [])

  async function togglePublish(post: Post) {
    const newStatus = post.status === 'published' ? 'draft' : 'published'
    setPosts(ps => ps.map(p => p.id === post.id ? { ...p, status: newStatus } : p))
    await updateDoc('blog-posts', post.id, { status: newStatus })
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this post?')) return
    await deleteDoc('blog-posts', id)
    setPosts(ps => ps.filter(p => p.id !== id))
    setTotal(t => t - 1)
  }

  const shown = posts.filter(p => {
    const matchTab = tab === 'All' || p.status === tab.toLowerCase()
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const published = posts.filter(p => p.status === 'published').length
  const drafts = posts.filter(p => p.status === 'draft').length

  return (
    <div className="app">
      <Sidebar counts={{ blog: total }} />
      <div className="main">
        <PageHeader title="Blog Posts" sub={`${total} posts · ${published} published · ${drafts} drafts`}>
          <SearchBar placeholder="Search posts…" value={search} onChange={setSearch} />
          <Link href="/cms/blog/new" className="btn btn-primary">{Icons.plus} New Post</Link>
        </PageHeader>

        <div className="filterbar">
          <div className="fseg">
            {['All', 'Published', 'Draft'].map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}
          </div>
        </div>

        <div className="tbl-wrap">
          {loading ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>
          ) : shown.length === 0 ? (
            <EmptyState title="No posts yet" desc="Create your first blog post to start building topical authority." action={<Link href="/cms/blog/new" className="btn btn-ghost" style={{ margin: '0 auto' }}>{Icons.plus} New post</Link>} />
          ) : (
            <table>
              <thead><tr>
                <th style={{ width: 92 }}>Preview</th>
                <th>Title</th><th>Tag</th><th>Status</th><th>Read time</th><th>Published</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr></thead>
              <tbody>
                {shown.map(p => {
                  const h = TAG_HUE[p.tag] || 198
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ width: 64, height: 42, borderRadius: 8, border: '1px solid var(--line)', overflow: 'hidden', background: `linear-gradient(135deg, hsl(${h} 70% 22%), hsl(${h} 60% 11%))`, display: 'grid', placeItems: 'center' }}>
                          <span style={{ color: `hsl(${h} 80% 70%)`, opacity: 0.7, display: 'grid', placeItems: 'center', width: 16 }}>{Icons.file}</span>
                        </div>
                      </td>
                      <td><div className="td-name" style={{ maxWidth: 380, lineHeight: 1.35, whiteSpace: 'normal' }}>{p.title || '(Untitled)'}</div></td>
                      <td>{p.tag ? <span className="pill tag" style={{ color: `hsl(${h} 80% 68%)`, background: `hsl(${h} 70% 50% / 0.13)` }}>{p.tag}</span> : <span className="muted">—</span>}</td>
                      <td><span className={'badge ' + (p.status === 'published' ? 'published' : 'draft')}>{p.status === 'published' ? 'Published' : 'Draft'}</span></td>
                      <td className="td-mono">{p.readTime || '—'}</td>
                      <td className="td-mono" style={{ fontSize: 12.5 }}>{p.publishedDate ? new Date(p.publishedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td>
                        <div className="row-actions">
                          <Link href={`/cms/blog/${p.id}`} className="icon-btn" title="Edit">{Icons.edit}</Link>
                          <button className="btn btn-sm btn-soft" onClick={() => togglePublish(p)}>{p.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                          <button className="icon-btn" title="Delete" onClick={() => handleDelete(p.id)}>{Icons.trash}</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="pager">
          <span className="pg-info">Showing {shown.length} of {total} posts</span>
          <div className="pg-btns"><button className="pg-btn">←</button><button className="pg-btn on">1</button><button className="pg-btn">→</button></div>
        </div>
      </div>
    </div>
  )
}

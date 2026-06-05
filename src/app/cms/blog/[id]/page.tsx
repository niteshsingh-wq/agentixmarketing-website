'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { fetchDoc, updateDoc, createDoc } from '@/components/cms/api'
import { Sidebar, Icons, useAuthGuard } from '@/components/cms/shared'

export default function BlogEditor() {
  useAuthGuard()
  const params = useParams()
  const router = useRouter()
  const isNew = params.id === 'new'

  const [post, setPost] = useState({ title: '', slug: '', tag: '', excerpt: '', status: 'draft', readTime: '', metaTitle: '', metaDescription: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTools, setActiveTools] = useState<string[]>([])

  useEffect(() => {
    if (!isNew) {
      fetchDoc('blog-posts', params.id as string).then(d => {
        if (d.id) setPost({ title: d.title || '', slug: d.slug || '', tag: d.tag || '', excerpt: d.excerpt || '', status: d.status || 'draft', readTime: d.readTime || '', metaTitle: d.metaTitle || '', metaDescription: d.metaDescription || '' })
      })
    }
  }, [params.id, isNew])

  function set(k: string, v: string) { setPost(p => ({ ...p, [k]: v })) }

  async function save() {
    setSaving(true)
    if (isNew) {
      const data = await createDoc('blog-posts', { ...post, publishedDate: post.status === 'published' ? new Date().toISOString() : null })
      if (data.doc?.id) router.replace(`/cms/blog/${data.doc.id}`)
    } else {
      await updateDoc('blog-posts', params.id as string, post)
    }
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggleTool(t: string) { setActiveTools(a => a.includes(t) ? a.filter(x => x !== t) : [...a, t]) }

  const TOOLS = [
    { id: 'bold', icon: 'bold' }, { id: 'italic', icon: 'italic' }, 'div' as const,
    { id: 'h2', label: 'H2' }, { id: 'h3', label: 'H3' }, 'div' as const,
    { id: 'quote', icon: 'quote' }, { id: 'code', icon: 'code' }, { id: 'link', icon: 'link' }, 'div' as const,
    { id: 'list', icon: 'list' },
  ]

  const mtLen = post.metaTitle.length, mdLen = post.metaDescription.length

  return (
    <div className="editor">
      <div className="ed-side">
        <h6>Post Settings</h6>
        <div className="toggle-row">
          <div className="tr-l">Status<small>{post.status === 'published' ? 'Visible on site' : 'Hidden draft'}</small></div>
          <div className={'toggle' + (post.status === 'published' ? ' on' : '')} onClick={() => set('status', post.status === 'published' ? 'draft' : 'published')}><i></i></div>
        </div>
        <div style={{ height: 1, background: 'var(--line)', margin: '10px 0 18px' }}></div>

        <div className="field"><label>Slug</label><input className="input" value={post.slug} onChange={e => set('slug', e.target.value)} placeholder="my-post-url" /></div>
        <div className="field"><label>Tag</label><input className="input" value={post.tag} onChange={e => set('tag', e.target.value)} placeholder="SEO, CRO, Migration…" /></div>
        <div className="field"><label>Read time</label><input className="input" value={post.readTime} onChange={e => set('readTime', e.target.value)} placeholder="8 min" /></div>
        <div className="field"><label>Excerpt</label>
          <textarea className="textarea" style={{ minHeight: 80, fontSize: 13 }} value={post.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Brief summary for cards and feeds…" />
        </div>
      </div>

      <div className="ed-main">
        <div className="ed-top">
          <Link href="/cms/blog" className="ed-back">
            <span style={{ transform: 'rotate(180deg)', display: 'grid', width: 15 }}>{Icons.chevRight}</span> Back to Posts
          </Link>
          {saved && <span className="ed-save"><span className="dot-live"></span> Saved</span>}
          <button className="btn btn-ghost btn-sm" onClick={() => { set('status', 'draft'); save() }}>Save Draft</button>
          <button className="btn btn-primary btn-sm" onClick={() => { set('status', 'published'); save() }} disabled={saving}>
            {saving ? 'Saving…' : <>{Icons.arrowUpRight} Publish</>}
          </button>
        </div>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <div className="ed-canvas">
            <input className="ed-title" value={post.title} onChange={e => set('title', e.target.value)} placeholder="Post title…" />
            <div className="ed-toolbar">
              {TOOLS.map((t, i) => t === 'div' ? <span className="ed-divider" key={i}></span> : (
                <button key={(t as {id:string}).id} className={'ed-tool' + (activeTools.includes((t as {id:string}).id) ? ' on' : '')} onClick={() => toggleTool((t as {id:string}).id)}>
                  {(t as {label?:string;icon?:string}).label ? (t as {label:string}).label : Icons[(t as {icon:string}).icon]}
                </button>
              ))}
            </div>
            <div className="prose" style={{ color: 'var(--muted)', fontSize: 15, marginTop: 16 }}>
              <p>Use Payload&apos;s admin at <Link href="/admin/collections/blog-posts" className="td-link" style={{ fontSize: 14 }}>admin → Blog Posts</Link> for full rich text editing. This view manages metadata and publish status.</p>
            </div>
          </div>

          <div className="seo-panel">
            <h6 style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--faint)', fontWeight: 500, marginBottom: 16 }}>SEO &amp; Search Preview</h6>
            <div className="field">
              <label>Meta title</label>
              <input className="input" value={post.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder={post.title} style={{ fontSize: 13 }} />
              <div className="charcount"><span>Recommended ≤ 60</span><b className={mtLen > 60 ? 'over' : ''}>{mtLen} / 60</b></div>
            </div>
            <div className="field">
              <label>Meta description</label>
              <textarea className="textarea" style={{ minHeight: 88, fontSize: 13 }} value={post.metaDescription} onChange={e => set('metaDescription', e.target.value)} placeholder="Describe this post for search engines…" />
              <div className="charcount"><span>Recommended ≤ 160</span><b className={mdLen > 160 ? 'over' : ''}>{mdLen} / 160</b></div>
            </div>
            {(post.metaTitle || post.title) && (
              <>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--muted)', marginBottom: 8, display: 'block' }}>Google preview</label>
                <div className="seo-preview">
                  <div className="g-url">agentixmarketing.com › blog › {post.slug || 'post-slug'}</div>
                  <div className="g-title">{(post.metaTitle || post.title).slice(0, 60)}{(post.metaTitle || post.title).length > 60 ? '…' : ''}</div>
                  <div className="g-desc">{post.metaDescription?.slice(0, 160)}{post.metaDescription?.length > 160 ? '…' : ''}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

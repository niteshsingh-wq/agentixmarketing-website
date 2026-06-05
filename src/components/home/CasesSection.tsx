'use client'
import { useRef } from 'react'
import { Arrow } from '@/components/ui/Arrow'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { AGENTIX } from '@/data/site'

const GRADS = [
  'linear-gradient(135deg,#0e8fe0,#38b6ff 60%,#7be0ff)',
  'linear-gradient(135deg,#1c1e23,#38b6ff)',
  'linear-gradient(135deg,#143d5c,#38b6ff)',
]

export function CasesSection() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.blog-card') as HTMLElement | null
    const amount = card ? card.offsetWidth + 18 : 360
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <section className="section theme-dark" id="work">
      <div className="wrap">
        <RevealWrapper className="blog-head">
          <div>
            <span className="eyebrow">From the blog</span>
            <h2 className="h2" style={{ marginTop: 20 }}>Growth, shipped.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Tactics, teardowns and playbooks from the work — Shopify, SEO and the AI-era of ecommerce.
            </p>
          </div>
          <div className="blog-nav">
            <button className="blog-arrow" onClick={() => scrollBy(-1)} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="blog-arrow" onClick={() => scrollBy(1)} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </RevealWrapper>

        <RevealWrapper>
          <div className="blog-track" ref={trackRef}>
            {AGENTIX.blog.map((p, i) => (
              <a className="blog-card" href="#work" onClick={e => e.preventDefault()} key={i}>
                <div className="blog-media" style={{ background: GRADS[i % GRADS.length] }}>
                  <span className="blog-tag">{p.tag}</span>
                </div>
                <div className="blog-body">
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <div className="blog-meta">
                    <span>{p.date} · {p.read} read</span>
                    <Arrow s={17} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </RevealWrapper>
      </div>
    </section>
  )
}

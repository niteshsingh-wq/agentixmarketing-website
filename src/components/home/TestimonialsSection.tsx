'use client'
import { useRef } from 'react'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { AGENTIX_CONTENT } from '@/data/content'

function Stars({ n }: { n: number }) {
  return (
    <div className="tm-stars" aria-label={`${n} out of 5`}>
      {[0, 1, 2, 3, 4].map(i => (
        <svg key={i} width="17" height="17" viewBox="0 0 24 24"
          fill={i < n ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.9l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.tm-card') as HTMLElement | null
    const amount = card ? card.offsetWidth + 18 : 380
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  const T = AGENTIX_CONTENT.testimonials

  return (
    <section className="section theme-dark">
      <div className="wrap">
        <RevealWrapper className="blog-head">
          <div>
            <span className="eyebrow">Testimonials</span>
            <h2 className="h2" style={{ marginTop: 18 }}>Real results, real feedback.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Success speaks louder than promises. Here&apos;s what partners say about the real-world
              impact of working with us.
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
          <div className="tm-track" ref={trackRef}>
            {T.map((t, i) => (
              <figure className="tm-card" key={i}>
                <div className="tm-card-top">
                  <Stars n={t.rating} />
                  <span className="tm-result">{t.result}</span>
                </div>
                <blockquote className="tm-quote">{t.quote}</blockquote>
                <figcaption className="tm-author">
                  <div className="tm-avatar">{t.author[0]}</div>
                  <div className="tm-meta">
                    <b>{t.author}</b>
                    <span>{t.role} · {t.company}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </RevealWrapper>
      </div>
    </section>
  )
}

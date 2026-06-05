import Link from 'next/link'
import { Arrow } from '@/components/ui/Arrow'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { AGENTIX } from '@/data/site'

export function ServicesSection() {
  return (
    <section className="section theme-dark" id="services">
      <div className="wrap">
        <RevealWrapper style={{ maxWidth: '760px' } as React.CSSProperties}>
          <span className="eyebrow">What we do</span>
          <h2 className="h2" style={{ marginTop: 20 }}>Two pillars. One growth engine.</h2>
          <p className="lead" style={{ marginTop: 22 }}>
            Visibility brings the right buyers to your store. Infrastructure makes sure they
            convert when they arrive. We run both as one system.
          </p>
        </RevealWrapper>

        <div className="pillars">
          {AGENTIX.pillars.map(p => (
            <RevealWrapper key={p.key} className="pillar">
              <span className="pillar-num">{p.num} — {p.title}</span>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <ul className="pillar-list">
                {p.services.map((s, i) => (
                  <li key={i}>
                    <Link href={`/services/${s.slug}`}>
                      <span>{s.name}</span>
                      <span className="meta">
                        {s.tag && (
                          <span style={{ fontSize: 9, background: 'var(--blue-soft)', color: 'var(--blue)', padding: '2px 6px', borderRadius: 5 }}>
                            {s.tag}
                          </span>
                        )}
                        {s.meta}<Arrow s={15} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

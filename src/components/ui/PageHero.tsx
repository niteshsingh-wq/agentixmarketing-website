import { RevealWrapper } from './RevealWrapper'

interface HeroStat { n: string; l: string }

interface PageHeroProps {
  eyebrow?: string
  title: string
  sub?: string
  actions?: React.ReactNode
  stats?: HeroStat[]
  wide?: boolean
}

export function PageHero({ eyebrow, title, sub, actions, stats, wide }: PageHeroProps) {
  return (
    <section className="svc-hero page-hero theme-dark" id="top">
      <div className="hero-glow"></div>
      <div className="wrap">
        <div className={'ph-inner' + (wide ? ' ph-wide' : '')}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="ph-title" style={{ marginTop: 18 }}>{title}</h1>
          {sub && <p className="ph-sub">{sub}</p>}
          {actions}
        </div>
        {stats && (
          <RevealWrapper className="hero-statline">
            {stats.map((s, i) => (
              <div className="hs" key={i}>
                <span className="n" dangerouslySetInnerHTML={{ __html: s.n }} />
                <span className="l">{s.l}</span>
              </div>
            ))}
          </RevealWrapper>
        )}
      </div>
    </section>
  )
}

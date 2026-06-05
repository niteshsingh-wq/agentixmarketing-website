import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { AGENTIX_CONTENT } from '@/data/content'

export function ClientShowcase() {
  const S = AGENTIX_CONTENT.clientShowcase
  return (
    <section className="section theme-light">
      <div className="wrap">
        <RevealWrapper style={{ maxWidth: 720 } as React.CSSProperties}>
          <span className="eyebrow">Clients we&apos;re proud of</span>
          <h2 className="h2" style={{ marginTop: 18 }}>Partnerships that value quality, innovation and results.</h2>
        </RevealWrapper>

        <div className="showcase-grid">
          {S.map(([name, quote], i) => (
            <RevealWrapper key={i} className="showcase-card">
              <div className="showcase-logo">{name}</div>
              <p>{quote}</p>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

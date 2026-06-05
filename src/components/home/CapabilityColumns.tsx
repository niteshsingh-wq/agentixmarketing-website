import { Arrow } from '@/components/ui/Arrow'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { AGENTIX_CONTENT } from '@/data/content'

export function CapabilityColumns() {
  const C = AGENTIX_CONTENT.capabilities
  return (
    <section className="section theme-light">
      <div className="wrap">
        <RevealWrapper style={{ maxWidth: 720 } as React.CSSProperties}>
          <span className="eyebrow">Driving ecommerce growth</span>
          <h2 className="h2" style={{ marginTop: 18 }}>Shopify &amp; SEO expertise across every stage.</h2>
          <p className="lead" style={{ marginTop: 20 }}>
            We guide brands through every stage of their ecommerce journey — building
            high-converting stores, scaling organic traffic, and engineering search dominance.
          </p>
        </RevealWrapper>

        <div className="cap-cols">
          {C.map(([name, desc], i) => (
            <RevealWrapper key={i} className="cap-col">
              <h3>{name} <Arrow s={20} /></h3>
              <p>{desc}</p>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

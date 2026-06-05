import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { AGENTIX } from '@/data/site'

export function ProofSection() {
  return (
    <section className="section theme-light" id="proof">
      <div className="wrap">
        <RevealWrapper style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 30, alignItems: 'end' } as React.CSSProperties}>
          <div>
            <span className="eyebrow">The receipts</span>
            <h2 className="h2" style={{ marginTop: 20, maxWidth: '16ch' }}>Numbers our clients actually feel.</h2>
          </div>
          <p className="lead" style={{ maxWidth: '34ch', marginBottom: 6 }}>
            Engineered outcomes across {AGENTIX.proof.length * 50}+ engagements — not vanity metrics.
          </p>
        </RevealWrapper>

        <div className="proof-grid">
          {AGENTIX.proof.map((p, i) => (
            <RevealWrapper key={i} className="proof-cell">
              <div className="pn">{p.n}</div>
              <div className="pl">{p.label}</div>
              <div className="pc">{p.code}</div>
            </RevealWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

import { Check } from '@/components/ui/Arrow'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { InlineLeadCard } from '@/components/lead/LeadModal'

export function LeadSection() {
  return (
    <section className="section theme-light" id="audit">
      <div className="wrap">
        <div className="lead-shell">
          <RevealWrapper className="lead-intro">
            <span className="eyebrow">Start here</span>
            <h2 style={{ marginTop: 18 }}>See what your store is leaving on the table.</h2>
            <p>Run a free instant SEO audit, or book a 30-minute strategy session. Either way you
              leave with specific, prioritised fixes — no obligation.</p>
            <div className="lead-trust">
              <div className="lt"><Check s={18} /><div>Live audit in ~20 seconds <span>— score + top fixes.</span></div></div>
              <div className="lt"><Check s={18} /><div>Strategy call with a senior specialist <span>— not a sales rep.</span></div></div>
              <div className="lt"><Check s={18} /><div>Clear next steps <span>— whether you hire us or not.</span></div></div>
            </div>
          </RevealWrapper>

          <RevealWrapper className="lead-card theme-dark" style={{ borderRadius: 'var(--radius)' } as React.CSSProperties}>
            <InlineLeadCard />
          </RevealWrapper>
        </div>
      </div>
    </section>
  )
}

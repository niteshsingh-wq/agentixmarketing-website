import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { AGENTIX_CONTENT } from '@/data/content'

export function ExcellenceLists() {
  const E = AGENTIX_CONTENT.excellence
  return (
    <section className="section theme-dark">
      <div className="wrap">
        <RevealWrapper className="excel-top">
          <div>
            <span className="eyebrow">Full capability map</span>
            <h2 style={{ marginTop: 18 }}>{E.heading}</h2>
          </div>
          <p>{E.body}</p>
        </RevealWrapper>

        <div className="excel-grid">
          {E.columns.map(([title, items], i) => (
            <RevealWrapper key={i} className="excel-col">
              <h5>{title}</h5>
              <ul>
                {items.map((it, j) => (
                  <li key={j}>
                    <span>{String(j + 1).padStart(2, '0')}</span>{it}
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

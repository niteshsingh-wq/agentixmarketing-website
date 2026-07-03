import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { AGENTIX_CONTENT } from '@/data/content'
import { linkify } from '@/lib/linkify'

export function IntroBand() {
  const C = AGENTIX_CONTENT.intro
  return (
    <section className="section theme-dark">
      <div className="wrap">
        <div className="intro-band">
          <RevealWrapper>
            <span className="eyebrow">{C.eyebrow}</span>
            <h2>{C.heading}</h2>
            <div className="intro-stat">
              <span className="n">{C.stat.n}</span>
              <span className="l">{C.stat.l}</span>
            </div>
          </RevealWrapper>
          <RevealWrapper>
            <p className="ib-body">{linkify(C.body, '/')}</p>
            <ul className="intro-points">
              {C.points.map((p, i) => (
                <li key={i}>
                  <span className="ip-n">0{i + 1}</span>
                  <span>{linkify(p, '/')}</span>
                </li>
              ))}
            </ul>
          </RevealWrapper>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import { Arrow } from '@/components/ui/Arrow'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import type { CaseStudy } from '@/data/case-studies'

export function CaseStudyCard({ cs }: { cs: CaseStudy }) {
  return (
    <RevealWrapper>
      <Link className="cs-card" href={`/case-studies/${cs.slug}`}>
        <span className="cs-industry">{cs.industry}</span>
        <div className="cs-client">{cs.client}</div>
        <h3 className="cs-result">{cs.result}</h3>
        <p className="cs-desc">{cs.desc}</p>
        <div className="cs-foot">
          <div className="cs-tags">
            {cs.tags.map(t => <span className="tag" key={t}>{t}</span>)}
          </div>
          <span className="cs-link">View case study <Arrow s={15} /></span>
        </div>
      </Link>
    </RevealWrapper>
  )
}

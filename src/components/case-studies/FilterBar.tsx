'use client'
import { useState } from 'react'
import { CaseStudyCard } from './CaseStudyCard'
import type { CaseStudy } from '@/data/case-studies'

const FILTERS = ['All', 'Shopify Development', 'SEO & Marketing', 'Ecommerce Growth']

export function FilterableGrid({ cases }: { cases: CaseStudy[] }) {
  const [filter, setFilter] = useState('All')
  const shown = filter === 'All' ? cases : cases.filter(c => c.cats.includes(filter))

  return (
    <>
      <div className="filter-bar">
        {FILTERS.map(f => (
          <button key={f} className={'filter-btn' + (f === filter ? ' on' : '')} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="cs-grid">
        {shown.map(cs => <CaseStudyCard key={cs.slug} cs={cs} />)}
      </div>
    </>
  )
}

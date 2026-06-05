'use client'
import { useState } from 'react'
import { RevealWrapper } from '@/components/ui/RevealWrapper'

const RESULT_CATS = [
  {
    id: 'shopify', label: 'Shopify Development',
    metrics: [
      { n: '+145%', l: 'Avg. mobile CVR lift' }, { n: '+40%', l: 'Avg. page speed improvement' },
      { n: '200+', l: 'Shopify stores shipped' }, { n: '5 wk', l: 'Avg. build to launch' },
      { n: '90+', l: 'Core Web Vitals score target' }, { n: '94%', l: 'Client retention rate' },
    ],
  },
  {
    id: 'seo', label: 'SEO & Marketing',
    metrics: [
      { n: '+285%', l: 'Avg. organic traffic growth' }, { n: '+180%', l: 'Avg. ranking improvement' },
      { n: '6–8 wk', l: 'Avg. time to first ranking gains' }, { n: 'DA 40+', l: 'Avg. link placement authority' },
      { n: '100+', l: 'Industries served' }, { n: '3.2x', l: 'Avg. revenue from SEO' },
    ],
  },
  {
    id: 'cro', label: 'CRO & Growth',
    metrics: [
      { n: '+65%', l: 'Avg. conversion rate improvement' }, { n: '+145%', l: 'Avg. mobile conversion lift' },
      { n: '7%', l: 'Revenue gain per second saved' }, { n: '42:1', l: 'Avg. email marketing ROI' },
      { n: '+180%', l: 'Avg. repeat purchase rate lift' }, { n: '+22%', l: 'Avg. checkout CVR lift' },
    ],
  },
]

export function ResultsTabs() {
  const [tab, setTab] = useState('shopify')
  const active = RESULT_CATS.find(c => c.id === tab) ?? RESULT_CATS[0]

  return (
    <>
      <div className="res-tabs">
        {RESULT_CATS.map(c => (
          <button key={c.id} className={'svc-ex-tab' + (c.id === tab ? ' on' : '')} onClick={() => setTab(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="success-stats" key={tab}>
        {active.metrics.map((m, i) => (
          <RevealWrapper key={i} className="success-cell">
            <div className="sn">{m.n}</div>
            <div className="sl">{m.l}</div>
            <div className="sc">/{String(i + 1).padStart(3, '0')}</div>
          </RevealWrapper>
        ))}
      </div>
    </>
  )
}

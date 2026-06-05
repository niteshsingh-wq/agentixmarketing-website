'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Arrow } from '@/components/ui/Arrow'
import { RevealWrapper } from '@/components/ui/RevealWrapper'
import { AGENTIX_CONTENT } from '@/data/content'
import type { ServiceGroup } from '@/data/content'

function ExplorerGroup({ group }: { group: ServiceGroup }) {
  const [tab, setTab] = useState(group.tabs[0].id)
  const active = group.tabs.find(t => t.id === tab) ?? group.tabs[0]
  return (
    <RevealWrapper className="svc-ex-group">
      <div className="svc-ex-head">
        <h3>{group.group}</h3>
        <span className="pill">{group.tabs.length} capability areas</span>
      </div>
      <div className="svc-ex-tabs">
        {group.tabs.map(t => (
          <button key={t.id} className={'svc-ex-tab' + (t.id === tab ? ' on' : '')} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="svc-ex-panel" key={tab}>
        {active.items.map(([title, tag, desc, slug], i) => (
          <Link key={i} href={`/services/${slug}`} className="svc-ex-card">
            <Arrow s={18} className="sx-arrow" />
            <span className="sx-tag">{tag}</span>
            <h4>{title}</h4>
            <p>{desc}</p>
          </Link>
        ))}
      </div>
    </RevealWrapper>
  )
}

export function ServicesExplorer() {
  const groups = AGENTIX_CONTENT.servicesDetail
  return (
    <section className="section theme-dark" id="services-detail">
      <div className="wrap">
        <RevealWrapper style={{ maxWidth: 720, marginBottom: 10 } as React.CSSProperties}>
          <span className="eyebrow">Everything we do</span>
          <h2 className="h2" style={{ marginTop: 18 }}>A full-stack growth team, explained.</h2>
          <p className="lead" style={{ marginTop: 20 }}>
            From the first line of theme code to the last backlink — here&apos;s the depth behind each side of the engine.
          </p>
        </RevealWrapper>
        {groups.map(g => <ExplorerGroup key={g.group} group={g} />)}
      </div>
    </section>
  )
}

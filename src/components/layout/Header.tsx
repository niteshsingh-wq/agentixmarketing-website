'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Arrow, Chevron } from '@/components/ui/Arrow'
import { useLeadModal } from '@/components/lead/LeadContext'

const MEGA = {
  Shopify: [
    ['Design & Development', [
      ['custom-shopify-store-development', 'Custom Store Development'],
      ['theme-design-customization', 'Theme Design & Customization'],
      ['shopify-plus-enterprise', 'Shopify Plus Enterprise', 'PLUS'],
      ['store-redesign-optimization', 'Store Redesign & Optimization'],
      ['platform-migration-to-shopify', 'Platform Migration'],
      ['b2b-wholesale-solutions', 'B2B & Wholesale'],
    ]],
    ['Advanced & Automation', [
      ['custom-shopify-app-development', 'Custom App Development'],
      ['api-third-party-integrations', 'API & Integrations'],
      ['multi-channel-integration', 'Multi-Channel Integration'],
      ['advanced-checkout-customization', 'Checkout Customization'],
      ['performance-speed-optimization', 'Speed Optimization'],
    ]],
  ],
  'Marketing & Growth': [
    ['Digital Marketing', [
      ['seo-strategy-implementation', 'SEO Strategy & Implementation'],
      ['on-page-technical-seo', 'On-Page & Technical SEO'],
      ['local-seo-google-business', 'Local SEO & Google Business'],
      ['ai-powered-seo-analytics', 'AI-Powered SEO Analytics', 'AI'],
      ['ecommerce-seo-online-stores', 'Ecommerce SEO'],
      ['content-marketing-link-building', 'Content & Link Building'],
    ]],
    ['Growth Services', [
      ['monthly-shopify-maintenance', 'Monthly Shopify Maintenance'],
      ['monthly-seo-monitoring', 'Monthly SEO Monitoring'],
      ['conversion-rate-optimization', 'Conversion Rate Optimization'],
      ['performance-analytics-reporting', 'Analytics & Reporting'],
      ['email-marketing-retention', 'Email & Retention'],
      ['ongoing-strategic-consultation', 'Strategic Consultation'],
    ]],
  ],
}

export function Header() {
  const { openLead } = useLeadModal()
  const [scrolled, setScrolled] = useState(false)
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  return (
    <>
      <header className={'hdr theme-dark' + (scrolled ? ' scrolled' : '')} style={{ backgroundColor: 'rgba(10,10,11,0)' }}>
        <div className="wrap">
          <div className="hdr-inner">
            <Link className="brand" href="/">
              <img src="/agentix-logo.png" alt="Agentix Marketing" style={{ width: 26, height: 26, objectFit: "contain", flexShrink: 0 }} /> Agentix Marketing
            </Link>

            <nav className="nav">
              {(Object.keys(MEGA) as (keyof typeof MEGA)[]).map(cat => (
                <div className="nav-item" key={cat}>
                  <button className="nav-link">{cat} <Chevron /></button>
                  <div className="mega">
                    {(MEGA[cat] as any[]).map(([label, items]: [string, [string, string, string?][]]) => (
                      <div key={label}>
                        <h5>{label}</h5>
                        <ul>
                          {items.map(([slug, name, tag]) => (
                            <li key={slug}>
                              <Link href={`/services/${slug}`}>
                                {name}{tag && <span className="tag">{tag}</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="nav-item"><Link className="nav-link" href="/case-studies">Case Studies</Link></div>
              <div className="nav-item"><Link className="nav-link" href="/results">Results</Link></div>
              <div className="nav-item"><Link className="nav-link" href="/about">About</Link></div>
            </nav>

            <div className="hdr-cta">
              <Link className="hdr-link" href="/contact">Contact</Link>
              <button className="btn btn-ghost" onClick={() => openLead('audit')}>Free SEO Audit</button>
              <button className="btn btn-primary" onClick={() => openLead('form')}>Book a strategy call <Arrow /></button>
              <button className={'hdr-burger' + (drawer ? ' open' : '')} onClick={() => setDrawer(!drawer)} aria-label="Menu">
                <span></span><span></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={'drawer theme-dark' + (drawer ? ' open' : '')}>
        {(Object.keys(MEGA) as (keyof typeof MEGA)[]).map(cat => (
          <div className="drawer-grp" key={cat}>
            <h5>{cat}</h5>
            {(MEGA[cat] as any[]).flatMap(([, items]: [string, [string, string][]]) => items).map(([slug, name]: [string, string]) => (
              <Link key={slug} href={`/services/${slug}`} className="drawer-sub" onClick={() => setDrawer(false)}>{name}</Link>
            ))}
          </div>
        ))}
        <Link href="/case-studies" onClick={() => setDrawer(false)}>Case Studies</Link>
        <Link href="/results" onClick={() => setDrawer(false)}>Results</Link>
        <Link href="/about" onClick={() => setDrawer(false)}>About</Link>
        <Link href="/contact" onClick={() => setDrawer(false)}>Contact</Link>
        <Link href="/careers" onClick={() => setDrawer(false)}>Careers</Link>
        <div className="drawer-foot">
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => { setDrawer(false); openLead('form') }}>
            Book a strategy call <Arrow />
          </button>
        </div>
      </div>
    </>
  )
}

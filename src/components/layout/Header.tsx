'use client'
import { useState, useEffect, useRef } from 'react'
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
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [openMega, setOpenMega] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const toggleAccordion = (key: string) => setOpenAccordion(v => v === key ? null : key)
  const toggleMega = (key: string) => setOpenMega(v => v === key ? null : key)

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

  useEffect(() => {
    if (!openMega) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenMega(null) }
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMega(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [openMega])

  return (
    <>
      <header className={'hdr theme-dark' + (scrolled ? ' scrolled' : '')} style={{ backgroundColor: 'rgba(10,10,11,0)' }}>
        <div className="wrap">
          <div className="hdr-inner">
            <Link className="brand" href="/">
              <img src="/agentix-logo.png" alt="Agentix" style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }} />
            </Link>

            <nav className="nav" ref={navRef}>
              {(Object.keys(MEGA) as (keyof typeof MEGA)[]).map(cat => {
                const isOpen = openMega === cat
                return (
                  <div className={'nav-item' + (isOpen ? ' nav-item--open' : '')} key={cat}>
                    <button className="nav-link" onClick={() => toggleMega(cat)} aria-expanded={isOpen}>
                      {cat} <Chevron />
                    </button>
                    <div className={'mega' + (isOpen ? ' mega--open' : '')}>
                      {(MEGA[cat] as any[]).map(([label, items]: [string, [string, string, string?][]]) => (
                        <div key={label}>
                          <h5>{label}</h5>
                          <ul>
                            {items.map(([slug, name, tag]) => (
                              <li key={slug}>
                                <Link href={`/services/${slug}`} onClick={() => setOpenMega(null)}>
                                  {name}{tag && <span className="tag">{tag}</span>}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
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
        {/* Primary nav links */}
        <div className="drw-nav">
          <Link className="drw-lnk" href="/case-studies" onClick={() => setDrawer(false)}>Case Studies</Link>
          <Link className="drw-lnk" href="/results" onClick={() => setDrawer(false)}>Results</Link>
          <Link className="drw-lnk" href="/about" onClick={() => setDrawer(false)}>About</Link>
          <Link className="drw-lnk" href="/contact" onClick={() => setDrawer(false)}>Contact</Link>
          <Link className="drw-lnk" href="/careers" onClick={() => setDrawer(false)}>Careers</Link>
        </div>

        {/* Service categories as accordion */}
        <div className="drw-svcs">
          {(Object.keys(MEGA) as (keyof typeof MEGA)[]).map(cat => {
            const isOpen = openAccordion === cat
            const items = (MEGA[cat] as any[]).flatMap(([, subs]: [string, [string, string, string?][]]) => subs)
            return (
              <div key={cat} className="drw-cat">
                <button
                  className={'drw-cat-hd' + (isOpen ? ' drw-cat-hd--open' : '')}
                  onClick={() => toggleAccordion(cat)}
                  aria-expanded={isOpen}
                >
                  {cat}
                  <Chevron />
                </button>
                {isOpen && (
                  <div className="drw-cat-bd">
                    {items.map(([slug, name]) => (
                      <Link
                        key={slug}
                        href={`/services/${slug}`}
                        className="drw-svc"
                        onClick={() => setDrawer(false)}
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="drw-foot">
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => { setDrawer(false); openLead('form') }}
          >
            Book a strategy call <Arrow />
          </button>
        </div>
      </div>
    </>
  )
}

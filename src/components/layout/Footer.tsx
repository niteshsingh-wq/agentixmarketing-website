'use client'
import Link from 'next/link'
import { useLeadModal } from '@/components/lead/LeadContext'
import { SERVICE_CATEGORIES } from '@/data/services'

export function Footer() {
  const { openLead } = useLeadModal()
  return (
    <footer className="foot">
      <div className="wrap">

        {/* Brand + tagline */}
        <div className="foot-brand">
          <Link className="brand" href="/">
            <img src="/agentix-logo.png" alt="Agentix Marketing" style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0 }} />
            Agentix Marketing
          </Link>
          <p>A results-driven Shopify &amp; SEO partner. We design, build and grow ecommerce brands that convert.</p>
          <div className="foot-brand-ctas">
            <button className="btn btn-primary btn-sm" onClick={() => openLead('form')}>Book a strategy call</button>
            <button className="btn btn-ghost btn-sm" onClick={() => openLead('audit')}>Free SEO Audit</button>
          </div>
        </div>

        {/* Services grid — all 4 categories */}
        <div className="foot-svcs">
          {Object.entries(SERVICE_CATEGORIES).map(([cat, { services }]) => (
            <div className="foot-col" key={cat}>
              <h5>{cat}</h5>
              <ul>
                {services.map(([slug, name]) => (
                  <li key={slug}><Link href={`/services/${slug}`}>{name}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          {/* Company / site links */}
          <div className="foot-col">
            <h5>Company</h5>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/case-studies">Case Studies</Link></li>
              <li><Link href="/results">Results</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/blog">Blog</Link></li>
            </ul>
          </div>
        </div>

        <div className="foot-wordmark">AGENTIX MARKETING</div>
        <div className="foot-bottom">
          <p>© 2026 Agentix Marketing. All rights reserved.</p>
          <p>Shopify Partner · SEO · Ecommerce Growth</p>
        </div>
      </div>
    </footer>
  )
}

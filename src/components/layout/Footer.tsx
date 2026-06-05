'use client'
import Link from 'next/link'
import { useLeadModal } from '@/components/lead/LeadContext'

export function Footer() {
  const { openLead } = useLeadModal()
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Link className="brand" href="/"><img src="/agentix-logo.png" alt="Agentix Marketing" style={{ width: 26, height: 26, objectFit: "contain", flexShrink: 0 }} /> Agentix Marketing</Link>
            <p>Agentix Marketing — a results-driven Shopify &amp; SEO partner. We design, build and grow ecommerce brands that convert.</p>
          </div>

          <div className="foot-col">
            <h5>Shopify</h5>
            <ul>
              <li><Link href="/services/custom-shopify-store-development">Custom Store Development</Link></li>
              <li><Link href="/services/theme-design-customization">Theme Customization</Link></li>
              <li><Link href="/services/shopify-plus-enterprise">Shopify Plus Enterprise</Link></li>
              <li><Link href="/services/platform-migration-to-shopify">Platform Migration</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h5>Marketing &amp; Growth</h5>
            <ul>
              <li><Link href="/services/seo-strategy-implementation">SEO Strategy</Link></li>
              <li><Link href="/services/ecommerce-seo-online-stores">Ecommerce SEO</Link></li>
              <li><Link href="/services/conversion-rate-optimization">Conversion Optimization</Link></li>
              <li><Link href="/services/email-marketing-retention">Email &amp; Retention</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h5>Company</h5>
            <ul>
              <li><Link href="/case-studies">Case Studies</Link></li>
              <li><Link href="/results">Results</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, opacity: 0.78, color: 'var(--ink-fg)', padding: 0 }}
                  onClick={() => openLead('audit')}>
                  Free SEO Audit
                </button>
              </li>
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

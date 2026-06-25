import Link from 'next/link'
import { SERVICE_CATEGORIES } from '@/data/services'

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">

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

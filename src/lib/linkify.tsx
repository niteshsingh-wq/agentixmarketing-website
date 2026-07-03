import type { ReactNode } from 'react'
import Link from 'next/link'

interface Rule { kw: string; url: string }

// Sorted conceptually by category; algorithm picks earliest+longest match automatically
const RULES: Rule[] = [
  // ── Shopify Design & Development ──────────────────────────────────────
  { kw: 'custom Shopify store development',      url: '/services/custom-shopify-store-development' },
  { kw: 'custom Shopify development',            url: '/services/custom-shopify-store-development' },
  { kw: 'Shopify store development',             url: '/services/custom-shopify-store-development' },
  { kw: 'Shopify development',                   url: '/services/custom-shopify-store-development' },
  { kw: 'Shopify theme customization',           url: '/services/theme-design-customization' },
  { kw: 'theme customization',                   url: '/services/theme-design-customization' },
  { kw: 'Shopify Plus enterprise',               url: '/services/shopify-plus-enterprise' },
  { kw: 'Shopify Plus migrations',               url: '/services/platform-migration-to-shopify' },
  { kw: 'Shopify Plus migration',                url: '/services/platform-migration-to-shopify' },
  { kw: 'Shopify Plus',                          url: '/services/shopify-plus-enterprise' },
  { kw: 'platform migration to Shopify',         url: '/services/platform-migration-to-shopify' },
  { kw: 'migration to Shopify',                  url: '/services/platform-migration-to-shopify' },
  { kw: 'WooCommerce',                           url: '/services/platform-migration-to-shopify' },
  { kw: 'BigCommerce',                           url: '/services/platform-migration-to-shopify' },
  { kw: 'Magento',                               url: '/services/platform-migration-to-shopify' },
  { kw: 'store redesign',                        url: '/services/store-redesign-optimization' },
  { kw: 'B2B wholesale solutions',               url: '/services/b2b-wholesale-solutions' },
  { kw: 'B2B ordering system',                   url: '/services/b2b-wholesale-solutions' },
  { kw: 'B2B ordering',                          url: '/services/b2b-wholesale-solutions' },
  { kw: 'B2B wholesale',                         url: '/services/b2b-wholesale-solutions' },
  { kw: 'wholesale solutions',                   url: '/services/b2b-wholesale-solutions' },
  { kw: 'net payment terms',                     url: '/services/b2b-wholesale-solutions' },
  // ── Advanced Development & Automation ─────────────────────────────────
  { kw: 'custom Shopify app development',        url: '/services/custom-shopify-app-development' },
  { kw: 'Shopify app development',               url: '/services/custom-shopify-app-development' },
  { kw: 'custom app development',                url: '/services/custom-shopify-app-development' },
  { kw: 'third-party integrations',              url: '/services/api-third-party-integrations' },
  { kw: 'multi-channel integration',             url: '/services/multi-channel-integration' },
  { kw: 'Shopify Functions',                     url: '/services/advanced-checkout-customization' },
  { kw: 'Checkout Extensions',                   url: '/services/advanced-checkout-customization' },
  { kw: 'checkout customization',                url: '/services/advanced-checkout-customization' },
  { kw: 'custom checkout',                       url: '/services/advanced-checkout-customization' },
  { kw: 'Core Web Vitals',                       url: '/services/performance-speed-optimization' },
  { kw: 'speed optimization',                    url: '/services/performance-speed-optimization' },
  { kw: 'page speed',                            url: '/services/performance-speed-optimization' },
  // ── Digital Marketing ─────────────────────────────────────────────────
  { kw: 'SEO strategy & implementation',         url: '/services/seo-strategy-implementation' },
  { kw: 'SEO strategy',                          url: '/services/seo-strategy-implementation' },
  { kw: 'keyword research',                      url: '/services/seo-strategy-implementation' },
  { kw: 'organic rankings',                      url: '/services/seo-strategy-implementation' },
  { kw: 'SEO rankings',                          url: '/services/seo-strategy-implementation' },
  { kw: 'search rankings',                       url: '/services/seo-strategy-implementation' },
  { kw: 'on-page & technical SEO',               url: '/services/on-page-technical-seo' },
  { kw: 'on-page SEO',                           url: '/services/on-page-technical-seo' },
  { kw: 'technical SEO',                         url: '/services/on-page-technical-seo' },
  { kw: 'structured data',                       url: '/services/on-page-technical-seo' },
  { kw: 'schema markup',                         url: '/services/on-page-technical-seo' },
  { kw: 'site architecture',                     url: '/services/on-page-technical-seo' },
  { kw: 'local SEO & Google Business',           url: '/services/local-seo-google-business' },
  { kw: 'Google Business',                       url: '/services/local-seo-google-business' },
  { kw: 'local SEO',                             url: '/services/local-seo-google-business' },
  { kw: 'AI-powered SEO analytics',              url: '/services/ai-powered-seo-analytics' },
  { kw: 'AI-powered SEO',                        url: '/services/ai-powered-seo-analytics' },
  { kw: 'ecommerce SEO for online stores',       url: '/services/ecommerce-seo-online-stores' },
  { kw: 'ecommerce SEO',                         url: '/services/ecommerce-seo-online-stores' },
  { kw: 'content marketing & link building',     url: '/services/content-marketing-link-building' },
  { kw: 'content marketing',                     url: '/services/content-marketing-link-building' },
  { kw: 'topical authority',                     url: '/services/content-marketing-link-building' },
  { kw: 'domain authority',                      url: '/services/content-marketing-link-building' },
  { kw: 'authority building',                    url: '/services/content-marketing-link-building' },
  { kw: 'link building',                         url: '/services/content-marketing-link-building' },
  { kw: 'backlinks',                             url: '/services/content-marketing-link-building' },
  { kw: 'backlink',                              url: '/services/content-marketing-link-building' },
  // ── Growth Services ───────────────────────────────────────────────────
  { kw: 'monthly Shopify maintenance',           url: '/services/monthly-shopify-maintenance' },
  { kw: 'Shopify maintenance',                   url: '/services/monthly-shopify-maintenance' },
  { kw: 'monthly SEO monitoring',                url: '/services/monthly-seo-monitoring' },
  { kw: 'SEO monitoring',                        url: '/services/monthly-seo-monitoring' },
  { kw: 'conversion rate optimization',          url: '/services/conversion-rate-optimization' },
  { kw: 'session recordings',                    url: '/services/conversion-rate-optimization' },
  { kw: 'session recording',                     url: '/services/conversion-rate-optimization' },
  { kw: 'heatmap analysis',                      url: '/services/conversion-rate-optimization' },
  { kw: 'A/B testing',                           url: '/services/conversion-rate-optimization' },
  { kw: 'CRO',                                   url: '/services/conversion-rate-optimization' },
  { kw: 'performance analytics & reporting',     url: '/services/performance-analytics-reporting' },
  { kw: 'performance analytics',                 url: '/services/performance-analytics-reporting' },
  { kw: 'email marketing & retention',           url: '/services/email-marketing-retention' },
  { kw: 'email marketing',                       url: '/services/email-marketing-retention' },
  { kw: 'Klaviyo',                               url: '/services/email-marketing-retention' },
  { kw: 'abandoned cart',                        url: '/services/email-marketing-retention' },
  { kw: 'ongoing strategic consultation',        url: '/services/ongoing-strategic-consultation' },
  { kw: 'strategic consultation',                url: '/services/ongoing-strategic-consultation' },
]

/** Find the earliest keyword match (longest wins on ties). Returns null if none found. */
function findEarliest(text: string, skip?: string): { idx: number; kw: string; url: string } | null {
  const textLower = text.toLowerCase()
  let best: { idx: number; kw: string; url: string } | null = null

  for (const { kw, url } of RULES) {
    if (skip && url === skip) continue
    const kwLower = kw.toLowerCase()
    let start = 0
    while (start <= text.length - kw.length) {
      const idx = textLower.indexOf(kwLower, start)
      if (idx === -1) break
      // Word-boundary check: prev/next chars must not be alphanumeric
      const prevOk = idx === 0 || !/[a-zA-Z0-9]/.test(text[idx - 1])
      const nextOk = idx + kw.length === text.length || !/[a-zA-Z0-9]/.test(text[idx + kw.length])
      if (prevOk && nextOk) {
        if (!best || idx < best.idx || (idx === best.idx && kw.length > best.kw.length)) {
          best = { idx, kw, url }
        }
        break
      }
      start = idx + 1
    }
  }

  return best
}

/**
 * Replace keyword occurrences in `text` with internal <Link> elements.
 * Pass `skip` (a URL path) to avoid self-referential links on the current page.
 */
export function linkify(text: string, skip?: string): ReactNode {
  const best = findEarliest(text, skip)
  if (!best) return text

  const { idx, kw, url } = best
  const before = text.slice(0, idx)
  const matched = text.slice(idx, idx + kw.length)
  const after = text.slice(idx + kw.length)

  return (
    <>
      {before ? linkify(before, skip) : null}
      <Link href={url} className="page-link">{matched}</Link>
      {after ? linkify(after, skip) : null}
    </>
  )
}

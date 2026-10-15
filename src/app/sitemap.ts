import { SITE_URL } from '@/lib/site'
import {
  getServiceEntries,
  getCaseStudyEntries,
  newestDate,
  STATIC_CONTENT_UPDATED,
} from '@/lib/content'
import type { MetadataRoute } from 'next'

/**
 * Regenerated at most hourly, and on demand whenever Payload content changes
 * (see revalidateContent in src/lib/revalidate.ts).
 */
export const revalidate = 3600

/**
 * Static routes that exist as files under src/app/(site).
 *
 * Deliberately excluded:
 *  - /blog and /blog/[slug] — the BlogPosts collection exists but there is no
 *    public route yet; both URLs currently 404, so listing them would put
 *    soft-404s in the sitemap.
 *  - /services — there is no services index route (404). Only /services/[slug].
 *  - /admin, /cms, /api — private, and disallowed in robots.txt.
 */
const STATIC_ROUTES: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}> = [
  { path: '', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/case-studies', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/results', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/careers', changeFrequency: 'monthly', priority: 0.5 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, caseStudies] = await Promise.all([
    getServiceEntries(),
    getCaseStudyEntries(),
  ])

  // Listing pages change whenever their underlying content does.
  const caseStudiesUpdated = newestDate(caseStudies, STATIC_CONTENT_UPDATED)
  const siteUpdated = newestDate(
    [...services, ...caseStudies],
    STATIC_CONTENT_UPDATED
  )

  const staticEntries = STATIC_ROUTES.map(r => ({
    url: `${SITE_URL}${r.path}`,
    lastModified:
      r.path === '' ? siteUpdated : r.path === '/case-studies' ? caseStudiesUpdated : STATIC_CONTENT_UPDATED,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const serviceEntries = services.map(s => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: s.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const caseStudyEntries = caseStudies.map(cs => ({
    url: `${SITE_URL}/case-studies/${cs.slug}`,
    lastModified: cs.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const all = [...staticEntries, ...serviceEntries, ...caseStudyEntries]

  // Final safety net: canonical host only, no private prefixes, no duplicates.
  const seen = new Set<string>()
  return all.filter(entry => {
    if (!entry.url.startsWith(`${SITE_URL}/`) && entry.url !== SITE_URL) return false
    if (/\/(admin|cms|api)(\/|$)/.test(entry.url)) return false
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}

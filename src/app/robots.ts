import { SITE_URL } from '@/lib/site'
import type { MetadataRoute } from 'next'

/**
 * robots.txt groups do NOT inherit from `User-agent: *`.
 *
 * A crawler picks the single most-specific group that matches its token and
 * ignores every other group. Previously the disallow rules lived only under
 * `*`, so naming Googlebot/GPTBot/Claude-Web/PerplexityBot in their own groups
 * silently granted them full access to /admin/, /api/ and /cms/.
 *
 * The policy is therefore repeated verbatim in every group.
 */
// No trailing slash on /admin and /cms: robots rules are prefix matches, so
// '/admin' covers both the bare /admin login route and everything under
// /admin/. No public URL starts with either prefix. /api/ keeps its slash.
const DISALLOW = ['/admin', '/api/', '/cms']

// Named crawlers we intentionally welcome. Listing them is an AEO signal; the
// access they get is identical to the wildcard group.
const NAMED_AGENTS = ['Googlebot', 'GPTBot', 'Claude-Web', 'PerplexityBot']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Public pages, CSS, JS, fonts and images all stay crawlable — only the
      // three private prefixes above are withheld.
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...NAMED_AGENTS.map(userAgent => ({
        userAgent,
        allow: '/',
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}

import { SITE_URL } from '@/lib/site'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/cms/'],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'Claude-Web', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

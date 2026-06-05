import { getAllServiceSlugs } from '@/data/services'
import { CASE_STUDIES } from '@/data/case-studies'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://agentixmarketing.com'
  const services = getAllServiceSlugs().map(slug => ({
    url: `${base}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  const caseStudies = CASE_STUDIES.map(cs => ({
    url: `${base}/case-studies/${cs.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/results`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/careers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...services,
    ...caseStudies,
  ]
}

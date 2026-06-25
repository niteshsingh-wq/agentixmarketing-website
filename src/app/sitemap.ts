import { getAllServiceSlugs } from '@/data/services'
import { CASE_STUDIES } from '@/data/case-studies'
import type { MetadataRoute } from 'next'

const LAUNCH = new Date('2026-06-06')
const LAST_UPDATE = new Date('2026-06-25')

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://agentixmarketing.com'
  const services = getAllServiceSlugs().map(slug => ({
    url: `${base}/services/${slug}`,
    lastModified: LAUNCH,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  const caseStudies = CASE_STUDIES.map(cs => ({
    url: `${base}/case-studies/${cs.slug}`,
    lastModified: LAUNCH,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))
  return [
    { url: base, lastModified: LAST_UPDATE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/case-studies`, lastModified: LAST_UPDATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/results`, lastModified: LAUNCH, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, lastModified: LAUNCH, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: LAUNCH, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/careers`, lastModified: LAUNCH, changeFrequency: 'monthly', priority: 0.5 },
    ...services,
    ...caseStudies,
  ]
}

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getService } from '@/data/services'
import { type Service } from '@/data/services'
import { buildMeta } from '@/lib/metadata'
import { ServicePage } from '@/components/services/ServicePage'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

function payloadToService(doc: any): Service {
  return {
    slug: doc.slug,
    title: doc.title || doc.slug,
    category: doc.category || '',
    tag: doc.tag || '',
    metaTitle: doc.metaTitle || '',
    metaDescription: doc.metaDescription || '',
    focusKeyword: doc.focusKeyword || '',
    lead: doc.lead || '',
    stats: (doc.stats || []).map((s: any) => ({ n: s.n || '', l: s.l || '' })),
    deliverables: (doc.deliverables || []).map((d: any) => [d.title || '', d.body || ''] as [string, string]),
    process: (doc.process || []).map((p: any) => [p.step || '', p.desc || ''] as [string, string]),
    faqs: (doc.faqs || []).map((f: any) => [f.q || '', f.a || ''] as [string, string]),
  }
}

async function fetchService(slug: string): Promise<Service | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({ collection: 'services', where: { slug: { equals: slug } }, limit: 1 })
    if (docs.length > 0) return payloadToService(docs[0])
  } catch (e) {
    console.error('[service] Payload fetch failed, using static data:', e)
  }
  return getService(slug) ?? null
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const service = await fetchService(slug)
  if (!service) return {}
  return buildMeta({
    title: service.metaTitle,
    description: service.metaDescription,
    canonical: `https://agentixmarketing.com/services/${slug}`,
  })
}

export default async function ServiceRoute(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const service = await fetchService(slug)
  if (!service) notFound()

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'Agentix',
      url: 'https://agentixmarketing.com',
    },
    areaServed: 'US',
    url: `https://agentixmarketing.com/services/${service.slug}`,
  }

  const faqJsonLd = service.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ServicePage service={service} />
    </>
  )
}

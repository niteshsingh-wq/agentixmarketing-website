import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getService } from '@/data/services'
import { type Service } from '@/data/services'
import { buildMeta } from '@/lib/metadata'
import { SITE_URL } from '@/lib/site'
import { ServicePage } from '@/components/services/ServicePage'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getServiceEntries, handlePayloadReadError, staticFallbackEnabled } from '@/lib/content'

/**
 * ISR. These are the primary SEO landing pages — serving them uncached meant
 * a Neon query on every crawl and every visit, and a
 * `private, no-cache, no-store` response that the CDN could not keep.
 *
 * Content edits invalidate this page immediately via the Services collection's
 * afterChange hook (src/lib/revalidate.ts); the interval is just a backstop.
 */
export const revalidate = 3600

/**
 * Prerender every known service at build time so the CDN can serve them.
 * Without this, a dynamic segment is rendered on demand for every request and
 * never cached. `dynamicParams` stays at its default (true), so a service
 * added in Payload after a deploy still renders — it is just generated on
 * first request and cached from then on.
 */
export async function generateStaticParams() {
  const entries = await getServiceEntries()
  return entries.map(e => ({ slug: e.slug }))
}

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
    handlePayloadReadError(`service ${slug}`, e)
  }
  return staticFallbackEnabled() ? getService(slug) ?? null : null
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
    canonical: `${SITE_URL}/services/${slug}`,
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
      url: SITE_URL,
    },
    areaServed: 'US',
    url: `${SITE_URL}/services/${service.slug}`,
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

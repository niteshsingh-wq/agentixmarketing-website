import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getService, getAllServiceSlugs } from '@/data/services'
import { buildMeta } from '@/lib/metadata'
import { ServicePage } from '@/components/services/ServicePage'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return getAllServiceSlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
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
  const service = getService(slug)
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

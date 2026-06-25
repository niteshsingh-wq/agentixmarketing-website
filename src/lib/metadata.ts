import type { Metadata } from 'next'

export function buildMeta(opts: {
  title: string
  description: string
  canonical: string
  ogImage?: string
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.canonical },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.canonical,
      siteName: 'Agentix Marketing',
      type: 'website',
      images: [{ url: opts.ogImage ?? 'https://agentixmarketing.com/agentix-logo.png', width: 512, height: 512, alt: 'Agentix Marketing' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
    },
  }
}

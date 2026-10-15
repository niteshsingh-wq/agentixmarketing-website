import type { CollectionConfig } from 'payload'
import { revalidateContent } from '../../lib/revalidate.ts'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'industry', 'result', 'createdAt'],
    description: 'Case study entries — create and edit from here.',
    group: 'Content',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'slug', type: 'text', required: true, unique: true, admin: { width: '35%', description: 'URL slug, e.g. skinlogic' } },
        { name: 'client', type: 'text', required: true, admin: { width: '35%' } },
        { name: 'industry', type: 'text', admin: { width: '30%' } },
      ],
    },
    { name: 'result', type: 'text', admin: { description: 'Headline stat — e.g. "+312% organic revenue in 8 months"' } },
    { name: 'desc', type: 'textarea', label: 'Short description', admin: { description: 'One-sentence summary shown on listing cards.' } },
    { name: 'lead', type: 'textarea', label: 'Lead paragraph', admin: { description: 'Opening paragraph on the detail page.' } },
    { name: 'challenge', type: 'textarea' },
    {
      name: 'tags',
      type: 'array',
      admin: { description: 'Display tags — e.g. Shopify Plus, SEO, CRO' },
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'cats',
      type: 'array',
      label: 'Categories',
      admin: { description: 'Used for filter buttons on the listing page.' },
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    {
      name: 'approach',
      type: 'array',
      label: 'Approach steps',
      admin: { description: 'What we did — shown as numbered cards on the detail page.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'metrics',
      type: 'array',
      label: 'Result metrics',
      admin: { description: 'Key numbers shown in the stat card and results section.' },
      fields: [
        { name: 'n', type: 'text', required: true, label: 'Number / stat', admin: { width: '40%' } },
        { name: 'l', type: 'text', required: true, label: 'Label', admin: { width: '60%' } },
      ],
    },
    {
      name: 'quote',
      type: 'group',
      label: 'Client quote',
      fields: [
        { name: 'text', type: 'textarea', label: 'Quote text' },
        {
          type: 'row',
          fields: [
            { name: 'author', type: 'text', admin: { width: '50%' } },
            { name: 'role', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta Title' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
      ],
    },
  ],
  hooks: {
    // Keep the cached case-study pages, the listing and the sitemap in sync.
    // Awaited, not fire-and-forget: on serverless the function can be frozen
    // as soon as the response is returned, so a floating promise here would
    // often never run and the cached page would go stale until the 1h backstop.
    afterChange: [
      async ({ doc, previousDoc }) => {
        await revalidateContent('case-studies', doc?.slug)
        // A slug change leaves the old URL cached — invalidate it too so it
        // 404s (or falls back to static data) instead of serving stale content.
        if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
          await revalidateContent('case-studies', previousDoc.slug)
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        await revalidateContent('case-studies', doc?.slug)
      },
    ],
  },
  timestamps: true,
}

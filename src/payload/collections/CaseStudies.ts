import type { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'brand',
    defaultColumns: ['brand', 'industry', 'result'],
    description: 'Case study entries for the Case Studies section.',
    group: 'Content',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'slug', type: 'text', required: true, unique: true, admin: { width: '50%' } },
        { name: 'brand', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'industry', type: 'text', admin: { width: '50%' } },
        { name: 'tag', type: 'text', admin: { width: '50%', description: 'E.g. SEO, Shopify Plus, CRO' } },
      ],
    },
    { name: 'result', type: 'text', admin: { description: 'Headline result stat. E.g. "+312% organic revenue in 8 months"' } },
    { name: 'excerpt', type: 'textarea' },
    { name: 'metaTitle', type: 'text', label: 'Meta Title' },
    { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
  ],
  timestamps: true,
}

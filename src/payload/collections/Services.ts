import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'metaTitle'],
    description: 'Override metadata for individual service pages without a code deploy.',
    group: 'Content',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Matches the URL slug. E.g. custom-shopify-store-development' },
    },
    { name: 'metaTitle', type: 'text', label: 'Meta Title Override' },
    { name: 'metaDescription', type: 'textarea', label: 'Meta Description Override' },
    { name: 'lead', type: 'textarea', label: 'Lead Paragraph Override', admin: { description: 'Override the opening paragraph for this service page.' } },
  ],
  timestamps: true,
}

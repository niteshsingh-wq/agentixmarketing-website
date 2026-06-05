import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['slug', 'title', 'category'],
    description: 'Full service page content — editable from admin without a code deploy.',
    group: 'Content',
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL slug. E.g. custom-shopify-store-development' },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'text', admin: { description: 'E.g. Shopify Design & Development' } },
    { name: 'tag', type: 'text', admin: { description: 'Short service tag label' } },
    { name: 'metaTitle', type: 'text', label: 'Meta Title' },
    { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
    { name: 'focusKeyword', type: 'text' },
    { name: 'lead', type: 'textarea', label: 'Lead Paragraph' },
    {
      name: 'stats',
      type: 'array',
      label: 'Hero Stats (3 numbers)',
      fields: [
        { name: 'n', type: 'text', required: true, label: 'Stat Number (e.g. +145%)' },
        { name: 'l', type: 'text', required: true, label: 'Stat Label' },
      ],
    },
    {
      name: 'deliverables',
      type: 'array',
      label: 'Deliverables',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'process',
      type: 'array',
      label: 'Process Steps',
      fields: [
        { name: 'step', type: 'text', required: true, label: 'Step Name' },
        { name: 'desc', type: 'textarea', required: true, label: 'Step Description' },
      ],
    },
    {
      name: 'faqs',
      type: 'array',
      label: 'FAQs',
      fields: [
        { name: 'q', type: 'text', required: true, label: 'Question' },
        { name: 'a', type: 'textarea', required: true, label: 'Answer' },
      ],
    },
  ],
  timestamps: true,
}

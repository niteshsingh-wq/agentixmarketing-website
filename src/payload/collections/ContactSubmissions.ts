import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'need', 'createdAt'],
    description: 'Contact form submissions from the website.',
    group: 'Pipeline',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: 'Phone Number', admin: { width: '50%', description: 'Include country code, e.g. +1 555 123 4567' } },
        { name: 'website', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      name: 'need',
      type: 'select',
      options: [
        { label: 'Shopify Development', value: 'Shopify Development' },
        { label: 'SEO & Marketing', value: 'SEO & Marketing' },
        { label: 'Shopify + SEO', value: 'Shopify + SEO' },
        { label: 'Not Sure Yet', value: 'Not sure yet' },
      ],
    },
    { name: 'message', type: 'textarea' },
  ],
  timestamps: true,
}

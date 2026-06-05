import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'company', 'rating', 'result'],
    description: 'Client testimonials for the Results and homepage sections.',
    group: 'Content',
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'author', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'role', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'company', type: 'text', admin: { width: '50%' } },
        {
          name: 'rating',
          type: 'select',
          defaultValue: '5',
          admin: { width: '50%' },
          options: [
            { label: '⭐⭐⭐⭐⭐ 5 stars', value: '5' },
            { label: '⭐⭐⭐⭐ 4 stars', value: '4' },
            { label: '⭐⭐⭐ 3 stars', value: '3' },
          ],
        },
      ],
    },
    { name: 'result', type: 'text', label: 'Result stat', admin: { description: 'E.g. "+312% revenue" — shown as the badge on the card.' } },
  ],
  timestamps: true,
}

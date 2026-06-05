import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'goal', 'status', 'createdAt'],
    description: 'Strategy form submissions and qualified prospects.',
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
    { name: 'website', type: 'text' },
    {
      type: 'row',
      fields: [
        {
          name: 'goal',
          type: 'select',
          admin: { width: '50%' },
          options: [
            { label: 'SEO & Visibility', value: 'SEO & visibility' },
            { label: 'Store Design / Build', value: 'Store design / build' },
            { label: 'Migration to Shopify', value: 'Migration to Shopify' },
            { label: 'Conversion (CRO)', value: 'Conversion (CRO)' },
            { label: 'Headless / Plus', value: 'Headless / Plus' },
            { label: 'Not Sure Yet', value: 'Not sure yet' },
          ],
        },
        {
          name: 'stage',
          type: 'select',
          admin: { width: '50%' },
          options: [
            { label: 'Pre-launch', value: 'Pre-launch' },
            { label: 'Live · Under $50k/mo', value: 'Live, under $50k/mo' },
            { label: '$50k – $250k/mo', value: '$50k–250k/mo' },
            { label: '$250k+/mo', value: '$250k+/mo' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'budget', type: 'text', admin: { width: '50%' } },
        { name: 'sourcePage', type: 'text', label: 'Source Page', admin: { width: '50%' } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Proposal Sent', value: 'proposal' },
        { label: 'Closed Won', value: 'closed-won' },
        { label: 'Closed Lost', value: 'closed-lost' },
      ],
    },
    { name: 'notes', type: 'textarea' },
    {
      type: 'collapsible',
      label: 'UTM Attribution',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'utmSource', type: 'text', label: 'UTM Source', admin: { width: '33%' } },
            { name: 'utmMedium', type: 'text', label: 'UTM Medium', admin: { width: '33%' } },
            { name: 'utmCampaign', type: 'text', label: 'UTM Campaign', admin: { width: '34%' } },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}

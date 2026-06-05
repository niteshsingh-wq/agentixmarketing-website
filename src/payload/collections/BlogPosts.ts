import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tag', 'status', 'publishedDate'],
    description: 'Blog posts for agentixmarketing.com — publish to build topical authority.',
    group: 'Content',
    livePreview: {
      url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${data.slug}`,
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { description: 'URL-friendly identifier. Used in: agentixmarketing.com/blog/[slug]' } },
    {
      type: 'row',
      fields: [
        { name: 'tag', type: 'text', admin: { width: '50%', description: 'E.g. SEO, CRO, Migration, Performance' } },
        { name: 'readTime', type: 'text', label: 'Read Time', admin: { width: '50%', description: 'E.g. 8 min' } },
      ],
    },
    { name: 'excerpt', type: 'textarea', admin: { description: 'Short description for listing cards and meta description fallback.' } },
    { name: 'content', type: 'richText', label: 'Post Content' },
    {
      type: 'collapsible',
      label: 'SEO & Metadata',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta Title', admin: { description: 'Recommended: ≤ 60 characters' } },
        { name: 'metaDescription', type: 'textarea', label: 'Meta Description', admin: { description: 'Recommended: ≤ 160 characters' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'draft',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          admin: { width: '50%' },
        },
        { name: 'publishedDate', type: 'date', label: 'Publish Date', admin: { width: '50%', date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', label: 'Featured Image' },
  ],
  timestamps: true,
}

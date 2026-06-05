import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Services } from './src/payload/collections/Services'
import { CaseStudies } from './src/payload/collections/CaseStudies'
import { BlogPosts } from './src/payload/collections/BlogPosts'
import { Leads } from './src/payload/collections/Leads'
import { ContactSubmissions } from './src/payload/collections/ContactSubmissions'
import { Testimonials } from './src/payload/collections/Testimonials'
import { Media } from './src/payload/collections/Media'
import { Users } from './src/payload/collections/Users'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,

  admin: {
    user: Users.slug,
    theme: 'dark',

    // Suppress React hydration warnings caused by Date/locale SSR differences
    suppressHydrationWarning: true,

    meta: {
      titleSuffix: '— Agentix',
      description: 'Agentix CMS — manage leads, content and collections.',
    },

    components: {
      graphics: {
        Logo: '/src/components/admin/AdminLogo#AdminLogo',
        Icon: '/src/components/admin/AdminLogo#AdminIcon',
      },
    },

    importMap: {
      baseDir: process.cwd(),
    },
  },

  collections: [
    // CRM pipeline
    Leads,
    ContactSubmissions,
    // Content
    BlogPosts,
    Testimonials,
    // Site content (reference overrides)
    Services,
    CaseStudies,
    // Assets & users
    Media,
    Users,
  ],

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    push: false,
  }),

  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET!,
})

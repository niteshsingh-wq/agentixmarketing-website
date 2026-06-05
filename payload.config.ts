import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
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
    suppressHydrationWarning: true,

    meta: {
      titleSuffix: '— Agentix Marketing',
      description: 'Agentix Marketing CMS — manage leads, content and collections.',
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
    Leads,
    ContactSubmissions,
    BlogPosts,
    Testimonials,
    Services,
    CaseStudies,
    Media,
    Users,
  ],

  // SQLite — single file database, no external server needed
  // Works on any Node.js hosting including Hostinger shared hosting
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./agentix.db',
    },
  }),

  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET!,
})

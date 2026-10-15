import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Services } from './src/payload/collections/Services.ts'
import { CaseStudies } from './src/payload/collections/CaseStudies.ts'
import { BlogPosts } from './src/payload/collections/BlogPosts.ts'
import { Leads } from './src/payload/collections/Leads.ts'
import { ContactSubmissions } from './src/payload/collections/ContactSubmissions.ts'
import { Testimonials } from './src/payload/collections/Testimonials.ts'
import { Media } from './src/payload/collections/Media.ts'
import { Users } from './src/payload/collections/Users.ts'

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

  db: postgresAdapter({
    // Never let `next dev` push schema changes straight into the database.
    // Pointed at Neon, dev push would alter (or offer to drop) production
    // tables, including the migration-only rate_limits table. Schema changes
    // go through `pnpm payload migrate:create` and committed migrations only.
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
    },
  }),

  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET!,
})

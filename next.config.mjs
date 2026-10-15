import { withPayload } from '@payloadcms/next/withPayload'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isDev = process.env.NODE_ENV === 'development'

/**
 * Content-Security-Policy.
 *
 * This is a STATIC policy rather than the nonce-based one in the Next docs,
 * deliberately: nonces must be unique per request, which forces dynamic
 * rendering on every page. That would undo the ISR caching the service and
 * case-study pages now rely on. A static policy keeps those pages cacheable
 * while still removing the useful primitives for injection
 * (object-src, base-uri, form-action, frame-ancestors).
 *
 * `'unsafe-inline'` in script-src is required by GA4's inline bootstrap and by
 * Next's own inline hydration scripts. It is the honest cost of a cacheable
 * static policy — documented rather than hidden.
 */
const GA = ['https://www.googletagmanager.com', 'https://www.google-analytics.com']
const GA_CONNECT = [
  ...GA,
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
  'https://*.googletagmanager.com',
]

function csp(directives) {
  return Object.entries(directives)
    .map(([key, values]) => (values.length ? `${key} ${values.join(' ')}` : key))
    .join('; ')
}

// Public site: strict-ish, cache-friendly.
const PUBLIC_CSP = csp({
  'default-src': ["'self'"],
  // 'unsafe-eval' only in dev — React uses eval for better error stacks.
  'script-src': ["'self'", "'unsafe-inline'", ...GA, ...(isDev ? ["'unsafe-eval'"] : [])],
  // React inline style={{...}} attributes require 'unsafe-inline'.
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:', 'https://agentixmarketing.com', ...GA],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", ...GA_CONNECT, ...(isDev ? ['ws:', 'wss:'] : [])],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  // Matches the existing X-Frame-Options: DENY — no behaviour change.
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
})

/**
 * Payload admin (/admin) and the custom CMS (/cms) need a looser policy:
 * Payload's admin bundle and the monaco-editor used in /cms both rely on
 * eval and blob: worker URLs. These routes are authenticated and noindex'd.
 */
const ADMIN_CSP = csp({
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'blob:'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'blob:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'blob:', ...(isDev ? ['ws:', 'wss:'] : [])],
  'worker-src': ["'self'", 'blob:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'agentixmarketing.com' },
    ],
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@payload-config': path.resolve(__dirname, 'payload.config.ts'),
    }
    return config
  },
  async headers() {
    const base = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ]

    return [
      {
        source: '/(.*)',
        headers: base,
      },
      {
        // Everything except /admin, /cms and /api gets the public policy.
        // Exclusive with the rule below so a response never carries two
        // Content-Security-Policy headers (browsers enforce the intersection,
        // which would break the admin bundle).
        source: '/((?!admin|cms|api).*)',
        headers: [{ key: 'Content-Security-Policy', value: PUBLIC_CSP }],
      },
      {
        source: '/:prefix(admin|cms)/:path*',
        headers: [{ key: 'Content-Security-Policy', value: ADMIN_CSP }],
      },
      {
        source: '/:prefix(admin|cms)',
        headers: [{ key: 'Content-Security-Policy', value: ADMIN_CSP }],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'agentixmarketing.com' }],
        destination: 'https://www.agentixmarketing.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)

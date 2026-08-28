import { withPayload } from '@payloadcms/next/withPayload'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
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

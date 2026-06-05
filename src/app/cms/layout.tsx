import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './cms.css'

const neueHaas = localFont({
  src: [
    { path: '../../../public/fonts/NeueHaasGrotesk-Light.otf', weight: '300' },
    { path: '../../../public/fonts/NeueHaasGrotesk-Regular.ttf', weight: '400' },
    { path: '../../../public/fonts/NeueHaasGrotesk-Medium.ttf', weight: '500' },
    { path: '../../../public/fonts/NeueHaasGrotesk-Bold.ttf', weight: '700' },
  ],
  variable: '--f-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { template: '%s — Agentix CMS', default: 'Agentix CMS' },
  robots: 'noindex, nofollow',
}

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={neueHaas.variable} style={{ background: '#050506' }}>
      <body>{children}</body>
    </html>
  )
}

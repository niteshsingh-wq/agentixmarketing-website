import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../globals.css'
import { LeadProvider } from '@/components/lead/LeadContext'
import { LeadModal } from '@/components/lead/LeadModal'
import { FloatCta } from '@/components/lead/FloatCta'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
  title: 'Agentix Marketing — Shopify Development & SEO Agency',
  description: 'Agentix Marketing — specialist Shopify development and SEO agency helping ecommerce brands grow.',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={neueHaas.variable}>
      <body>
        <LeadProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <LeadModal />
          <FloatCta />
        </LeadProvider>
      </body>
    </html>
  )
}

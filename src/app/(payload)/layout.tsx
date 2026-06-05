import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'

// Pre-compiled admin CSS — contains html[data-theme=dark] elevation overrides
// that SCSS compilation misses in dev/webpack mode
import '@payloadcms/next/css'

const serverFunction: ServerFunctionClient = async (args) => {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
      htmlProps={{
        suppressHydrationWarning: true,
        'data-scroll-behavior': 'smooth',
      } as React.HtmlHTMLAttributes<HTMLHtmlElement>}
    >
      {children}
    </RootLayout>
  )
}

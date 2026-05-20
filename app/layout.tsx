import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import './globals.css'
import { AuthRedirectGuard } from '@/components/AuthRedirectGuard'

export const metadata: Metadata = {
  title: 'No Me Olvides',
  description: 'Patrimonio cultural de la España vaciada. Un mapa de voces, memoria y territorio.',
}

const supabaseOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
      : null
  } catch {
    return null
  }
})()

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} className="h-full">
      <head>
        {/* Preconnect a los subdominios de tiles de OSM y a Supabase
            para arrancar el handshake antes de que Leaflet/los queries
            pidan recursos. Mejora LCP en mobile. */}
        <link rel="preconnect" href="https://a.tile.openstreetmap.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://b.tile.openstreetmap.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://c.tile.openstreetmap.org" crossOrigin="anonymous" />
        {supabaseOrigin && (
          <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <AuthRedirectGuard />
        {children}
      </body>
    </html>
  )
}

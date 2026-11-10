import type { Metadata } from 'next'
import { Vollkorn, Karla } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'
import { AuthRedirectGuard } from '@/components/AuthRedirectGuard'
import { siteUrl } from '@/lib/seo'

// Identidad de marca: Vollkorn para títulos (serif rústica, terrosa — encaja
// con un proyecto sobre tierra y memoria rural), Karla para el resto del
// texto (humanista, cálida, suaviza el contraste con una serif tan robusta).
const vollkorn = Vollkorn({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-vollkorn',
  display: 'swap',
})
const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-karla',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Tú no me olvides',
    template: '%s · Tú no me olvides',
  },
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
    <html lang={locale} className={`h-full ${vollkorn.variable} ${karla.variable}`}>
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

import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import './globals.css'

export const metadata: Metadata = {
  title: 'No Me Olvides',
  description: 'Patrimonio cultural de la España vaciada. Un mapa de voces, memoria y territorio.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}

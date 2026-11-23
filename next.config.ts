import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  // La versión en francés se retiró el 2026-11-23 (la web queda en español e
  // inglés). Sus direcciones ya estaban indexadas: se redirigen de forma
  // permanente (301) a su equivalente en inglés, que es el idioma más cercano
  // para un visitante francófono, en vez de devolver un error.
  async redirects() {
    return [
      { source: '/fr', destination: '/en', permanent: true },
      { source: '/fr/a-propos', destination: '/en/about', permanent: true },
      { source: '/fr/contact', destination: '/en/contact', permanent: true },
      { source: '/fr/mentions-legales', destination: '/en/legal-notice', permanent: true },
      { source: '/fr/politique-de-confidentialite', destination: '/en/privacy-policy', permanent: true },
      { source: '/fr/politique-cookies', destination: '/en/cookie-policy', permanent: true },
      { source: '/fr/:path*', destination: '/en', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)

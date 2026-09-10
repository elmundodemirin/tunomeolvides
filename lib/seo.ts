import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import type { Locality } from '@/lib/types'
import { pickLocalized } from '@/lib/locality'

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tunomeolvides.es'

type Locale = (typeof routing.locales)[number]

const OG_LOCALES: Record<Locale, string> = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
}

// Ruta de cada página en cada idioma. ES no lleva prefijo (routing.localePrefix
// = 'as-needed'); EN/FR sí, y con el slug traducido. Debe reflejar los
// nombres de carpeta reales bajo app/[locale]/.
export const PAGE_PATHS = {
  home: { es: '/', en: '/en', fr: '/fr' },
  about: { es: '/sobre', en: '/en/about', fr: '/fr/a-propos' },
  contact: { es: '/contacto', en: '/en/contact', fr: '/fr/contact' },
  legalNotice: { es: '/aviso-legal', en: '/en/legal-notice', fr: '/fr/mentions-legales' },
  privacy: { es: '/privacidad', en: '/en/privacy-policy', fr: '/fr/politique-de-confidentialite' },
  cookiePolicy: { es: '/politica-de-cookies', en: '/en/cookie-policy', fr: '/fr/politique-cookies' },
} as const satisfies Record<string, Record<Locale, string>>

type PageKey = keyof typeof PAGE_PATHS

/**
 * Metadata por página: title/description propios + canonical + hreflang
 * (alternates.languages) apuntando a las tres versiones de idioma, tal y
 * como recomienda Google para contenido multi-idioma.
 */
export function buildPageMetadata({
  page,
  locale,
  title,
  description,
  absoluteTitle = false,
}: {
  page: PageKey
  locale: Locale
  title: string
  description: string
  /** true solo para la home: evita que el template "%s · No Me Olvides" del layout raíz duplique el nombre de marca. */
  absoluteTitle?: boolean
}): Metadata {
  const paths = PAGE_PATHS[page]
  const canonicalUrl = new URL(paths[locale], siteUrl).toString()

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: new URL(paths.es, siteUrl).toString(),
        en: new URL(paths.en, siteUrl).toString(),
        fr: new URL(paths.fr, siteUrl).toString(),
        'x-default': new URL(paths.es, siteUrl).toString(),
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'No Me Olvides',
      locale: OG_LOCALES[locale],
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

/**
 * JSON-LD (Schema.org) para la home: describe el sitio y, como ItemList,
 * cada localidad activa como TouristAttraction. No hay URL individual por
 * localidad todavía (solo existen como popups en el mapa), así que se
 * enlaza a external_url cuando existe.
 */
export function buildHomeJsonLd(localities: Locality[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'No Me Olvides',
        url: siteUrl,
        inLanguage: locale,
      },
      {
        '@type': 'ItemList',
        itemListElement: localities.map((loc, index) => {
          const audioUrl = pickLocalized(locale, loc.audio_url_es, loc.audio_url_en)
          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'TouristAttraction',
              name: loc.name,
              description: pickLocalized(locale, loc.description_es, loc.description_en),
              address: {
                '@type': 'PostalAddress',
                addressLocality: loc.province,
                addressRegion: loc.region,
                addressCountry: 'ES',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: loc.latitude,
                longitude: loc.longitude,
              },
              ...(loc.external_url ? { url: loc.external_url } : {}),
              ...(audioUrl ? { subjectOf: { '@type': 'AudioObject', contentUrl: audioUrl } } : {}),
            },
          }
        }),
      },
    ],
  }
}

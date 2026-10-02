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

// Mismo eslogan que ya existe en messages/*.json (home.metaTitle) — se
// reutiliza aquí para el alt de la imagen de Open Graph/Twitter, en vez de
// inventar una traducción nueva.
const OG_IMAGE_ALT: Record<Locale, string> = {
  es: 'Tú no me olvides, mapa sonoro de la España vaciada',
  en: 'Tú no me olvides, a sound map of rural Spain',
  fr: "Tú no me olvides, carte sonore de l'Espagne rurale",
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
  /** true solo para la home: evita que el template "%s · Tú no me olvides" del layout raíz duplique el nombre de marca. */
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
      siteName: 'Tú no me olvides',
      locale: OG_LOCALES[locale],
      type: 'website',
      images: [
        {
          url: new URL('/og-image.png', siteUrl).toString(),
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT[locale],
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [new URL('/og-image.png', siteUrl).toString()],
    },
  }
}

// Mismo texto que messages/*.json → about.metaDescription (reutilizado,
// no inventado) — describe a la organización, no a la home en concreto.
const ORGANIZATION_DESCRIPTION: Record<Locale, string> = {
  es: 'Tú no me olvides documenta y preserva el patrimonio cultural de los pueblos de la España vaciada mediante audios narrados en primera persona.',
  en: 'Tú no me olvides documents and preserves the cultural heritage of depopulated rural Spanish villages through first-person audio narratives.',
  fr: "Tú no me olvides documente et préserve le patrimoine culturel des villages de l'Espagne rurale grâce à des récits audio à la première personne.",
}

/**
 * JSON-LD (Schema.org) de la organización — igual en cualquier idioma salvo
 * la descripción. Se incluye en la home (ver buildHomeJsonLd); un único
 * Organization basta para que Google entienda la entidad detrás del sitio,
 * no hace falta repetirlo en cada página.
 */
function buildOrganizationSchema(locale: string) {
  const loc = (locale in ORGANIZATION_DESCRIPTION ? locale : 'es') as Locale
  return {
    '@type': 'Organization',
    name: 'Tú no me olvides',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: new URL('/logo-tunomeolvides.png', siteUrl).toString(),
      width: 1215,
      height: 445,
    },
    description: ORGANIZATION_DESCRIPTION[loc],
    areaServed: {
      '@type': 'Country',
      name: 'España',
    },
  }
}

/**
 * JSON-LD (Schema.org) para la home: describe la organización, el sitio y,
 * como ItemList, cada localidad activa como TouristAttraction. No hay URL
 * individual por localidad todavía (solo existen como popups en el mapa),
 * así que se enlaza a external_url cuando existe.
 */
export function buildHomeJsonLd(localities: Locality[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationSchema(locale),
      {
        '@type': 'WebSite',
        name: 'Tú no me olvides',
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

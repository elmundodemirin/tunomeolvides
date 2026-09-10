import type { MetadataRoute } from 'next'
import { siteUrl, PAGE_PATHS } from '@/lib/seo'

type PageKey = keyof typeof PAGE_PATHS

// Prioridad relativa y frecuencia de cambio esperada de cada página.
// No hay entradas por localidad porque hoy no existen URLs propias por
// pueblo (se muestran como popups dentro del mapa de la home) — ver nota
// en la conversación con la promotora sobre páginas individuales por localidad.
const ENTRIES: { page: PageKey; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { page: 'home', changeFrequency: 'weekly', priority: 1 },
  { page: 'about', changeFrequency: 'monthly', priority: 0.6 },
  { page: 'contact', changeFrequency: 'yearly', priority: 0.5 },
  { page: 'legalNotice', changeFrequency: 'yearly', priority: 0.1 },
  { page: 'privacy', changeFrequency: 'yearly', priority: 0.1 },
  { page: 'cookiePolicy', changeFrequency: 'yearly', priority: 0.1 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return ENTRIES.flatMap(({ page, changeFrequency, priority }) => {
    const paths = PAGE_PATHS[page]
    const languages = {
      es: new URL(paths.es, siteUrl).toString(),
      en: new URL(paths.en, siteUrl).toString(),
      fr: new URL(paths.fr, siteUrl).toString(),
    }

    return (Object.keys(paths) as Array<keyof typeof paths>).map((locale) => ({
      url: languages[locale],
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }))
  })
}

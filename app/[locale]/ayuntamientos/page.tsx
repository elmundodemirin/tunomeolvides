import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteUrl } from '@/lib/seo'

// Página solo en español: los ayuntamientos son una figura administrativa
// española y su público (concejales, técnicos municipales) lee en español.
// No existe equivalente /en o /fr.

const TITLE = '¿Tu municipio tiene una historia que contar?'
const SUBTITLE =
  'No Me Olvides ofrece a los pequeños ayuntamientos un servicio completo de digitalización turística: investigamos tu patrimonio, lo narramos y lo ponemos en el mapa.'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (locale !== 'es') return {}

  const description =
    'Servicio de digitalización turística para ayuntamientos: investigación del patrimonio local, audioguía por QR y datos de visitantes. Primera consulta gratuita.'
  const url = `${siteUrl}/ayuntamientos`

  return {
    title: 'Para ayuntamientos',
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${TITLE} · No Me Olvides`,
      description,
      url,
      siteName: 'No Me Olvides',
      locale: 'es_ES',
      type: 'website',
    },
    twitter: { card: 'summary', title: TITLE, description },
  }
}

function SearchIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="17" cy="17" r="10" stroke="#C9633E" strokeWidth="2.5" />
      <line x1="24.5" y1="24.5" x2="33" y2="33" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function HeadphonesIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M8 22v-2a12 12 0 0 1 24 0v2" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <rect x="5" y="21" width="7" height="11" rx="3.5" stroke="#C9633E" strokeWidth="2.5" />
      <rect x="28" y="21" width="7" height="11" rx="3.5" stroke="#C9633E" strokeWidth="2.5" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <line x1="7" y1="33" x2="33" y2="33" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="10" y="22" width="6" height="11" rx="1.5" stroke="#C9633E" strokeWidth="2.5" />
      <rect x="19" y="14" width="6" height="19" rx="1.5" stroke="#C9633E" strokeWidth="2.5" />
      <rect x="28" y="18" width="6" height="15" rx="1.5" stroke="#C9633E" strokeWidth="2.5" />
    </svg>
  )
}

const COLUMNS = [
  {
    Icon: SearchIcon,
    title: 'Investigación',
    body: 'Visitamos el municipio, entrevistamos a sus vecinos y consultamos sus archivos. Cada historia está verificada en fuentes primarias.',
  },
  {
    Icon: HeadphonesIcon,
    title: 'Guía digital en destino',
    body: 'Códigos QR en cada punto de interés que activan una audioguía narrada en español e inglés. Sin app, sin registro, 24 horas al día.',
  },
  {
    Icon: ChartIcon,
    title: 'Datos de tus visitantes',
    body: 'Por primera vez sabrás cuántas personas visitan tu municipio, de dónde vienen y qué les interesa. Inteligencia turística real para cualquier ayuntamiento.',
  },
]

export default async function AyuntamientosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (locale !== 'es') notFound()

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1
        className="text-3xl lg:text-4xl leading-tight mb-4"
        style={{ fontFamily: 'Georgia, serif', color: 'var(--color-terracotta-dark)' }}
      >
        {TITLE}
      </h1>
      <p className="text-base lg:text-lg leading-relaxed mb-14 max-w-2xl" style={{ color: 'var(--color-text)' }}>
        {SUBTITLE}
      </p>

      <div className="grid sm:grid-cols-3 gap-8 mb-14">
        {COLUMNS.map(({ Icon, title, body }) => (
          <div key={title}>
            <Icon />
            <h2
              className="text-lg mt-4 mb-2"
              style={{ fontFamily: 'Georgia, serif', color: 'var(--color-terracotta-dark)' }}
            >
              {title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
              {body}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl px-6 py-6 mb-14"
        style={{ backgroundColor: 'var(--color-cream-dark)' }}
      >
        <p className="text-sm lg:text-base leading-relaxed" style={{ color: 'var(--color-text)' }}>
          El proyecto puede financiarse con subvenciones públicas. Nos encargamos de identificar
          las convocatorias disponibles para tu municipio y gestionar todo el proceso de solicitud.
        </p>
      </div>

      <div>
        <Link
          href="/contacto"
          className="inline-block py-3 px-6 rounded-lg text-white font-medium text-sm transition-colors"
          style={{ backgroundColor: 'var(--color-terracotta)' }}
        >
          Solicita información
        </Link>
        <p className="text-xs mt-3" style={{ color: 'var(--color-sage-dark)' }}>
          Sin compromiso. Primera consulta gratuita.
        </p>
      </div>
    </div>
  )
}

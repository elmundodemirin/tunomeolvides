import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { siteUrl } from '@/lib/seo'

// Página solo en español: los ayuntamientos son una figura administrativa
// española y su público (concejales, técnicos municipales) lee en español.
// No existe equivalente /en o /fr.

const TITLE = '¿Tu municipio tiene una historia que contar?'

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
      title: `${TITLE} · Tú no me olvides`,
      description,
      url,
      siteName: 'Tú no me olvides',
      locale: 'es_ES',
      type: 'website',
    },
    twitter: { card: 'summary', title: TITLE, description },
  }
}

function SearchIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="17" cy="17" r="10" stroke="var(--color-terracota)" strokeWidth="2.5" />
      <line x1="24.5" y1="24.5" x2="33" y2="33" stroke="var(--color-terracota)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function HeadphonesIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M8 22v-2a12 12 0 0 1 24 0v2" stroke="var(--color-terracota)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <rect x="5" y="21" width="7" height="11" rx="3.5" stroke="var(--color-terracota)" strokeWidth="2.5" />
      <rect x="28" y="21" width="7" height="11" rx="3.5" stroke="var(--color-terracota)" strokeWidth="2.5" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <line x1="7" y1="33" x2="33" y2="33" stroke="var(--color-terracota)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="10" y="22" width="6" height="11" rx="1.5" stroke="var(--color-terracota)" strokeWidth="2.5" />
      <rect x="19" y="14" width="6" height="19" rx="1.5" stroke="var(--color-terracota)" strokeWidth="2.5" />
      <rect x="28" y="18" width="6" height="15" rx="1.5" stroke="var(--color-terracota)" strokeWidth="2.5" />
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
    body: 'Códigos QR en cada punto de interés que activan una audioguía narrada en español, con inglés opcional. Sin app, sin registro, 24 horas al día.',
  },
  {
    Icon: ChartIcon,
    title: 'Datos de tus visitantes',
    body: 'Por primera vez sabrás cuántas personas visitan tu municipio, de dónde vienen y qué les interesa. Datos anónimos y agregados, sin registro y conformes al RGPD.',
  },
]

const PROCESS_STEPS = [
  { title: 'Visita e investigación', body: 'Visita y entrevistas con los vecinos.' },
  { title: 'Documentación', body: 'Investigación en archivos y en el libro o la historia local.' },
  { title: 'Producción', body: 'Textos, audios y web.' },
  { title: 'Puesta en marcha', body: 'Instalación de los QR e informe de visitas.' },
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
      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/ods11.png"
          alt="ODS 11 — Ciudades y comunidades sostenibles"
          width={32}
          height={32}
          className="rounded-marca shrink-0"
        />
        <p className="text-sm leading-snug" style={{ color: 'var(--color-tinta)' }}>
          <strong style={{ color: 'var(--color-terracota)' }}>Proyecto subvencionable.</strong>{' '}
          Contribuimos al ODS 11 protegiendo el patrimonio cultural de los pueblos y generando
          desarrollo local.
        </p>
      </div>
      <h1
        className="text-3xl lg:text-4xl leading-tight mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-terracota)' }}
      >
        {TITLE}
      </h1>
      <p className="text-base lg:text-lg leading-relaxed mb-14 max-w-2xl" style={{ color: 'var(--color-tinta)' }}>
        <span className="marca">Tú no me olvides</span> ofrece a los pequeños ayuntamientos un servicio completo de
        digitalización turística: investigamos tu patrimonio, lo narramos y lo ponemos en el mapa.
      </p>

      <div className="grid sm:grid-cols-3 gap-8 mb-14">
        {COLUMNS.map(({ Icon, title, body }) => (
          <div key={title}>
            <Icon />
            <h2
              className="text-lg mt-4 mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-terracota)' }}
            >
              {title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-tinta)' }}>
              {body}
            </p>
          </div>
        ))}
      </div>

      <h2
        className="text-xl mb-6"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-terracota)' }}
      >
        Cómo trabajamos
      </h2>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {PROCESS_STEPS.map((step, i) => (
          <li key={step.title}>
            <span
              className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mb-3"
              style={{ backgroundColor: 'var(--color-terracota)', color: 'white' }}
            >
              {i + 1}
            </span>
            <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-terracota)' }}>
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-tinta)' }}>
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div
        className="rounded-marca px-6 py-7 mb-14 border-l-4"
        style={{ backgroundColor: 'var(--color-papel-hondo)', borderColor: 'var(--color-terracota)' }}
      >
        <h2
          className="text-lg mb-3"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-terracota)' }}
        >
          Así lo hicimos en Cabezas del Pozo
        </h2>
        <p className="text-sm lg:text-base leading-relaxed mb-3" style={{ color: 'var(--color-tinta)' }}>
          Nuestro primer municipio piloto, en La Moraña (Ávila), ya tiene su web turística completa:
          11 sitios de interés con ficha propia, 2 rutas documentadas (a pie y en coche), sus
          establecimientos y su agenda de fiestas y eventos — todo en un solo mes de trabajo.
        </p>
        <a
          href="https://cabezasdelpozo.tunomeolvides.es"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline"
          style={{ color: 'var(--color-terracota)' }}
        >
          Ver cabezasdelpozo.tunomeolvides.es →
        </a>
      </div>

      <div
        className="rounded-marca px-6 py-6 mb-14"
        style={{ backgroundColor: 'var(--color-papel-hondo)' }}
      >
        <p className="text-sm lg:text-base leading-relaxed" style={{ color: 'var(--color-tinta)' }}>
          Presupuesto adaptado al municipio; te ayudamos a buscar financiación (LEADER, Diputación…).
        </p>
      </div>

      <div>
        <Link
          href="/contacto"
          className="inline-block py-3 px-6 rounded-marca text-white font-medium text-sm transition-colors"
          style={{ backgroundColor: 'var(--color-terracota)' }}
        >
          Solicita información
        </Link>
        <p className="text-xs mt-3" style={{ color: 'var(--color-olivo)' }}>
          Sin compromiso. Primera consulta gratuita.
        </p>
      </div>
    </div>
  )
}

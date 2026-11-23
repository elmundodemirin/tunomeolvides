import Image from 'next/image'
import Link from 'next/link'

// Página de servicio para ayuntamientos, en español (/ayuntamientos) e inglés
// (/en/for-councils). Un único componente con los textos de los dos idiomas,
// para que el diseño no se desincronice entre versiones.

type Locale = 'es' | 'en'

export const COUNCILS_TEXT = {
  es: {
    navLabel: 'Para ayuntamientos',
    metaTitle: 'Para ayuntamientos',
    metaDescription:
      'Servicio de digitalización turística para ayuntamientos: investigación del patrimonio local, audioguía por QR y datos de visitantes. Primera consulta gratuita.',
    odsAlt: 'ODS 11 — Ciudades y comunidades sostenibles',
    odsStrong: 'Proyecto subvencionable.',
    odsText: 'Contribuimos al ODS 11 protegiendo el patrimonio cultural de los pueblos y generando desarrollo local.',
    title: '¿Tu municipio tiene una historia que contar?',
    intro:
      'ofrece a los pequeños ayuntamientos un servicio completo de digitalización turística: investigamos tu patrimonio, lo narramos y lo ponemos en el mapa.',
    columns: [
      {
        title: 'Investigación',
        body: 'Visitamos el municipio, entrevistamos a sus vecinos y consultamos sus archivos. Cada historia está verificada en fuentes primarias.',
      },
      {
        title: 'Guía digital en destino',
        body: 'Códigos QR en cada punto de interés que activan una audioguía narrada en español, con inglés opcional. Sin app, sin registro, 24 horas al día.',
      },
      {
        title: 'Datos de tus visitantes',
        body: 'Por primera vez sabrás cuántas personas visitan tu municipio, de dónde vienen y qué les interesa. Datos anónimos y agregados, sin registro y conformes al RGPD.',
      },
    ],
    processTitle: 'Cómo trabajamos',
    steps: [
      { title: 'Visita e investigación', body: 'Visita y entrevistas con los vecinos.' },
      { title: 'Documentación', body: 'Investigación en archivos y en el libro o la historia local.' },
      { title: 'Producción', body: 'Textos, audios y web.' },
      { title: 'Puesta en marcha', body: 'Instalación de los QR e informe de visitas.' },
    ],
    caseTitle: 'Así lo hicimos en Cabezas del Pozo',
    caseBody:
      'Nuestro primer municipio piloto, en La Moraña (Ávila), ya tiene su web turística completa: 11 sitios de interés con ficha propia, 2 rutas documentadas (a pie y en coche), sus establecimientos y su agenda de fiestas y eventos — todo en un solo mes de trabajo.',
    caseLink: 'Ver cabezasdelpozo.tunomeolvides.es →',
    budget: 'Presupuesto adaptado al municipio; te ayudamos a buscar financiación (LEADER, Diputación…).',
    cta: 'Solicita información',
    ctaHref: '/contacto',
    ctaNote: 'Sin compromiso. Primera consulta gratuita.',
  },
  en: {
    navLabel: 'For councils',
    metaTitle: 'For local councils',
    metaDescription:
      'Tourism digitisation for local councils: research into local heritage, QR audio guides and visitor data. First consultation free of charge.',
    odsAlt: 'SDG 11 — Sustainable cities and communities',
    odsStrong: 'Eligible for funding.',
    odsText: 'We contribute to SDG 11 by protecting the cultural heritage of rural villages and fostering local development.',
    title: 'Does your village have a story to tell?',
    intro:
      'offers small local councils a complete tourism digitisation service: we research your heritage, tell its story and put it on the map.',
    columns: [
      {
        title: 'Research',
        body: 'We visit the village, interview its residents and consult its archives. Every story is checked against primary sources.',
      },
      {
        title: 'On-site digital guide',
        body: 'QR codes at each point of interest that play an audio guide narrated in Spanish, with optional English. No app, no sign-up, 24 hours a day.',
      },
      {
        title: 'Data on your visitors',
        body: 'For the first time you will know how many people visit your village, where they come from and what interests them. Anonymous, aggregated data, with no sign-up and fully GDPR-compliant.',
      },
    ],
    processTitle: 'How we work',
    steps: [
      { title: 'Visit and research', body: 'A visit and interviews with residents.' },
      { title: 'Documentation', body: 'Research in archives and in local books and histories.' },
      { title: 'Production', body: 'Texts, audio and website.' },
      { title: 'Launch', body: 'QR codes installed and a visitor report.' },
    ],
    caseTitle: 'How we did it in Cabezas del Pozo',
    caseBody:
      'Our first pilot village, in La Moraña (Ávila), now has its own complete tourism website: 11 places of interest, each with its own page, 2 documented routes (on foot and by car), its local businesses and its calendar of festivals and events — all in just one month of work.',
    caseLink: 'Visit cabezasdelpozo.tunomeolvides.es →',
    budget: 'Budget tailored to each council; we help you find funding (LEADER, provincial councils…).',
    cta: 'Request information',
    ctaHref: '/en/contact',
    ctaNote: 'No commitment. First consultation free of charge.',
  },
} as const

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

const ICONS = [SearchIcon, HeadphonesIcon, ChartIcon]

export function CouncilsPage({ locale }: { locale: Locale }) {
  const t = COUNCILS_TEXT[locale]
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 mb-6">
        <Image src="/ods11.png" alt={t.odsAlt} width={32} height={32} className="rounded-marca shrink-0" />
        <p className="text-sm leading-snug" style={{ color: 'var(--color-tinta)' }}>
          <strong style={{ color: 'var(--color-terracota)' }}>{t.odsStrong}</strong> {t.odsText}
        </p>
      </div>
      <h1
        className="text-3xl lg:text-4xl leading-tight mb-4"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-terracota)' }}
      >
        {t.title}
      </h1>
      <p className="text-base lg:text-lg leading-relaxed mb-14 max-w-2xl" style={{ color: 'var(--color-tinta)' }}>
        <span className="marca">Tú no me olvides</span> {t.intro}
      </p>

      <div className="grid sm:grid-cols-3 gap-8 mb-14">
        {t.columns.map(({ title, body }, i) => {
          const Icon = ICONS[i]
          return (
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
          )
        })}
      </div>

      <h2 className="text-xl mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-terracota)' }}>
        {t.processTitle}
      </h2>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {t.steps.map((step, i) => (
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
        <h2 className="text-lg mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-terracota)' }}>
          {t.caseTitle}
        </h2>
        <p className="text-sm lg:text-base leading-relaxed mb-3" style={{ color: 'var(--color-tinta)' }}>
          {t.caseBody}
        </p>
        <a
          href="https://cabezasdelpozo.tunomeolvides.es"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline"
          style={{ color: 'var(--color-terracota)' }}
        >
          {t.caseLink}
        </a>
      </div>

      <div className="rounded-marca px-6 py-6 mb-14" style={{ backgroundColor: 'var(--color-papel-hondo)' }}>
        <p className="text-sm lg:text-base leading-relaxed" style={{ color: 'var(--color-tinta)' }}>
          {t.budget}
        </p>
      </div>

      <div>
        <Link
          href={t.ctaHref}
          className="inline-block py-3 px-6 rounded-marca text-white font-medium text-sm transition-colors"
          style={{ backgroundColor: 'var(--color-terracota)' }}
        >
          {t.cta}
        </Link>
        <p className="text-xs mt-3" style={{ color: 'var(--color-olivo)' }}>
          {t.ctaNote}
        </p>
      </div>
    </div>
  )
}

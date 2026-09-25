import { getTranslations } from 'next-intl/server'

function MonumentIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M6 16 L20 6 L34 16" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9" y1="16" x2="9" y2="30" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16.3" y1="16" x2="16.3" y2="30" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="23.7" y1="16" x2="23.7" y2="30" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="31" y1="16" x2="31" y2="30" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="5" y1="33" x2="35" y2="33" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function RouteIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M8 34 C8 24 20 24 20 16 C20 8 32 8 32 4"
        stroke="#C9633E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="8" cy="34" r="3" fill="#C9633E" />
      <circle cx="32" cy="4" r="3" fill="#C9633E" />
    </svg>
  )
}

function VenuesIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M11 5v11M14 5v11M17 5v11" stroke="#C9633E" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11 16c0 2 1.5 3 3 3s3-1 3-3" stroke="#C9633E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <line x1="14" y1="19" x2="14" y2="35" stroke="#C9633E" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M28 5c-3.5 4-3.5 8.5 0 12.5" stroke="#C9633E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <line x1="28" y1="17.5" x2="28" y2="35" stroke="#C9633E" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function EventsIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="6" y="10" width="28" height="24" rx="3" stroke="#C9633E" strokeWidth="2.5" />
      <line x1="6" y1="17" x2="34" y2="17" stroke="#C9633E" strokeWidth="2.5" />
      <line x1="13" y1="6" x2="13" y2="13" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="27" y1="6" x2="27" y2="13" stroke="#C9633E" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="14" cy="24.5" r="1.8" fill="#C9633E" />
      <circle cx="20" cy="28.5" r="1.8" fill="#C9633E" />
      <circle cx="26" cy="24.5" r="1.8" fill="#C9633E" />
    </svg>
  )
}

type Props = { locale: string }

// Bloque "Qué es No Me Olvides", primera sección de la home (encima del mapa).
export async function HomeIntro({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'homeIntro' })

  const points = [
    { Icon: MonumentIcon, title: t('poiTitle'), body: t('poiBody') },
    { Icon: RouteIcon, title: t('routesTitle'), body: t('routesBody') },
    { Icon: VenuesIcon, title: t('venuesTitle'), body: t('venuesBody') },
    { Icon: EventsIcon, title: t('eventsTitle'), body: t('eventsBody') },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1
        className="text-2xl lg:text-4xl leading-tight mb-5 max-w-3xl"
        style={{ fontFamily: 'Georgia, serif', color: 'var(--color-terracotta-dark)' }}
      >
        {t('title')}
      </h1>
      <p className="text-sm lg:text-base leading-relaxed mb-12 max-w-2xl" style={{ color: 'var(--color-text)' }}>
        {t('intro')}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {points.map(({ Icon, title, body }) => (
          <div key={title}>
            <Icon />
            <h2
              className="text-base mt-4 mb-2"
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
    </div>
  )
}

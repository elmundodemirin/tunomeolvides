import { getTranslations } from 'next-intl/server'

function MonumentIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M6 16 L20 6 L34 16" stroke="var(--color-terracota)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9" y1="16" x2="9" y2="30" stroke="var(--color-terracota)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16.3" y1="16" x2="16.3" y2="30" stroke="var(--color-terracota)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="23.7" y1="16" x2="23.7" y2="30" stroke="var(--color-terracota)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="31" y1="16" x2="31" y2="30" stroke="var(--color-terracota)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="5" y1="33" x2="35" y2="33" stroke="var(--color-terracota)" strokeWidth="2.5" strokeLinecap="round" />
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

function VenuesIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M11 5v11M14 5v11M17 5v11" stroke="var(--color-terracota)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M11 16c0 2 1.5 3 3 3s3-1 3-3" stroke="var(--color-terracota)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <line x1="14" y1="19" x2="14" y2="35" stroke="var(--color-terracota)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M28 5c-3.5 4-3.5 8.5 0 12.5" stroke="var(--color-terracota)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <line x1="28" y1="17.5" x2="28" y2="35" stroke="var(--color-terracota)" strokeWidth="2.2" strokeLinecap="round" />
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

type Props = { locale: string }

// Bloque «Todo lo que una población necesita para darse a conocer», debajo del
// mapa: los cuatro pilares del servicio (oficina de turismo digital, guía,
// escaparate y datos de visitantes). El texto del escaparate (venuesBody) es el
// texto original sobre la repercusión del turismo en las poblaciones y se
// mantiene literal por decisión de la promotora.
export async function HomeIntro({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'homeIntro' })

  const points = [
    { Icon: MonumentIcon, title: t('officeTitle'), body: t('officeBody') },
    { Icon: HeadphonesIcon, title: t('guideTitle'), body: t('guideBody') },
    { Icon: VenuesIcon, title: t('venuesTitle'), body: t('venuesBody') },
    { Icon: ChartIcon, title: t('dataTitle'), body: t('dataBody') },
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h2
        className="text-2xl lg:text-4xl leading-tight mb-5 max-w-3xl mx-auto text-center"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-terracota)' }}
      >
        {t.rich('title', { marca: (chunks) => <span className="marca">{chunks}</span> })}
      </h2>
      <p className="text-sm lg:text-base leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: 'var(--color-tinta)' }}>
        {t('intro')}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {points.map(({ Icon, title, body }) => (
          <div key={title}>
            <Icon />
            <h3
              className="text-base mt-4 mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-terracota)' }}
            >
              {title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-tinta)' }}>
              {body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

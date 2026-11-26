import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

type Props = { locale: string }

// Resumen «Para ayuntamientos» al final de la home, en español e inglés. La
// página completa vive en /ayuntamientos y /en/for-councils.
export async function HomeAyuntamientosTeaser({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'councilsTeaser' })
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h2
        className="text-2xl lg:text-3xl leading-tight mb-4 text-center"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-terracota)' }}
      >
        {t('title')}
      </h2>
      <p className="text-sm lg:text-base leading-relaxed mb-6" style={{ color: 'var(--color-tinta)' }}>
        {t.rich('body', { marca: (chunks) => <span className="marca">{chunks}</span> })}
      </p>
      <div className="text-center">
        <Link
          href={locale === 'es' ? '/ayuntamientos' : '/en/for-councils'}
          className="inline-block py-3 px-6 rounded-marca text-white font-medium text-sm transition-colors"
          style={{ backgroundColor: 'var(--color-terracota)' }}
        >
          {t('cta')}
        </Link>
      </div>
    </div>
  )
}

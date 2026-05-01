import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import type { Locality } from '@/lib/types'
import MapWrapper from '@/components/MapWrapper'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  const { data: localities, error } = await supabase
    .from('localities')
    .select('*')
    .eq('active', true)
    .order('name')

  if (error) {
    return <p className="p-8" style={{ color: 'var(--color-terracotta)' }}>{t('errorLoading')}: {error.message}</p>
  }

  const list = (localities as Locality[]) ?? []

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-72px)]">
      {/* Panel narrativo izquierdo (placeholder; lista real en paso 2.2) */}
      <aside
        className="lg:w-2/5 lg:max-w-[480px] lg:overflow-y-auto px-6 py-8 lg:px-10 lg:py-12"
        style={{ backgroundColor: 'var(--color-cream)' }}
      >
        <h1
          className="text-3xl lg:text-4xl leading-tight mb-4"
          style={{ fontFamily: 'Georgia, serif', color: 'var(--color-terracotta-dark)' }}
        >
          {t('title')}
        </h1>
        <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>
          {t('lead')}
        </p>
        <div className="text-sm uppercase tracking-wide" style={{ color: 'var(--color-sage-dark)' }}>
          {t('localitiesCount', { count: list.length })}
        </div>
      </aside>

      {/* Mapa derecho */}
      <div className="h-[60vh] lg:h-auto lg:flex-1 lg:w-3/5">
        <MapWrapper localities={list} locale={locale} />
      </div>
    </div>
  )
}

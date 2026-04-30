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

  return (
    <div className="flex-1">
      <MapWrapper localities={(localities as Locality[]) ?? []} locale={locale} />
    </div>
  )
}

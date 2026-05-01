import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import type { Locality } from '@/lib/types'
import HomeShell from '@/components/HomeShell'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  const { data: localities, error } = await supabase
    .from('localities')
    .select('*')
    .eq('active', true)
    .order('name')

  if (error) {
    return (
      <p className="p-8" style={{ color: 'var(--color-terracotta)' }}>
        {t('errorLoading')}: {error.message}
      </p>
    )
  }

  return <HomeShell localities={(localities as Locality[]) ?? []} locale={locale} />
}

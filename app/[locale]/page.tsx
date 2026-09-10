import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { supabase } from '@/lib/supabase'
import type { Locality } from '@/lib/types'
import HomeShell from '@/components/HomeShell'
import { buildPageMetadata, buildHomeJsonLd } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: 'es' | 'en' | 'fr' }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return buildPageMetadata({
    page: 'home',
    locale,
    title: t('metaTitle'),
    description: t('metaDescription'),
    absoluteTitle: true,
  })
}

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

  const activeLocalities = (localities as Locality[]) ?? []
  const jsonLd = buildHomeJsonLd(activeLocalities, locale)

  return (
    <>
      <script
        type="application/ld+json"
        // Escapamos "<" para evitar que una descripción con "</script>" rompa el HTML.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <HomeShell localities={activeLocalities} locale={locale} />
    </>
  )
}

import { getTranslations } from 'next-intl/server'

export default async function SobrePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl mb-6" style={{ color: 'var(--color-terracotta-dark)' }}>{t('title')}</h1>
      <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>{t('intro')}</p>
      <p className="leading-relaxed mb-10" style={{ color: 'var(--color-text)' }}>{t('body')}</p>
      <div className="border-t pt-6" style={{ borderColor: 'var(--color-cream-dark)' }}>
        <p className="text-sm" style={{ color: 'var(--color-sage-dark)' }}>
          {t('promoter')}: <strong>{t('promoterName')}</strong>
        </p>
      </div>
    </div>
  )
}

import { getTranslations } from 'next-intl/server'

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-3xl mb-4" style={{ color: 'var(--color-terracotta-dark)' }}>{t('title')}</h1>
      <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-text)' }}>{t('intro')}</p>

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{t('name')}</label>
          <input type="text" placeholder={t('namePlaceholder')}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--color-cream-dark)', backgroundColor: 'white',
                     ['--tw-ring-color' as string]: 'var(--color-terracotta)' }} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{t('email')}</label>
          <input type="email" placeholder={t('emailPlaceholder')}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--color-cream-dark)', backgroundColor: 'white' }} />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{t('message')}</label>
          <textarea placeholder={t('messagePlaceholder')} rows={5}
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
            style={{ borderColor: 'var(--color-cream-dark)', backgroundColor: 'white' }} />
        </div>

        <div className="flex items-start gap-3">
          <input type="checkbox" id="consent" className="mt-1 accent-[#C9633E]" />
          <label htmlFor="consent" className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>
            {t('consent')}
          </label>
        </div>

        <button type="submit"
          className="py-3 px-6 rounded text-white font-medium text-sm transition-opacity hover:opacity-90 self-start"
          style={{ backgroundColor: 'var(--color-terracotta)' }}>
          {t('send')}
        </button>
      </form>
    </div>
  )
}

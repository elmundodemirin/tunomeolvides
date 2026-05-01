import { getTranslations } from 'next-intl/server'
import { ContactForm } from '@/components/ContactForm'

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1
        className="text-3xl mb-4"
        style={{ color: 'var(--color-terracotta-dark)', fontFamily: 'Georgia, serif' }}
      >
        {t('title')}
      </h1>
      <p className="mb-8 leading-relaxed" style={{ color: 'var(--color-text)' }}>
        {t('intro')}
      </p>
      <ContactForm />
    </div>
  )
}

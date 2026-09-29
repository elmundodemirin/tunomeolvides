'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Modal } from '@/components/Modal'
import { PrivacyContent } from '@/components/PrivacyContent'

export function ContactForm() {
  const t = useTranslations('contact')
  const locale = useLocale()

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPrivacy, setShowPrivacy] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!consent) {
      setConsentError(true)
      return
    }

    setLoading(true)
    setError(null)
    setConsentError(false)

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, consent_given: true }),
    })

    if (res.ok) {
      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
      setConsent(false)
    } else {
      setError(t('error'))
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="rounded-marca border border-olivo bg-papel-hondo px-6 py-8 text-center">
        <div className="text-3xl mb-3">✉️</div>
        <p className="font-medium text-olivo" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('successTitle')}
        </p>
        <p className="text-sm text-tinta/80 mt-2">{t('successBody')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-tinta">
          {t('name')} <span className="text-terracota">*</span>
        </label>
        <input
          type="text" name="name" required
          value={form.name} onChange={handleChange}
          placeholder={t('namePlaceholder')}
          className="border border-papel-hondo bg-white rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-tinta">
          {t('email')} <span className="text-terracota">*</span>
        </label>
        <input
          type="email" name="email" required
          value={form.email} onChange={handleChange}
          placeholder={t('emailPlaceholder')}
          className="border border-papel-hondo bg-white rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-tinta">
          {t('message')} <span className="text-terracota">*</span>
        </label>
        <textarea
          name="message" required
          value={form.message} onChange={handleChange}
          placeholder={t('messagePlaceholder')} rows={5}
          className="border border-papel-hondo bg-white rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent resize-none"
        />
      </div>

      {/* Consentimiento — NO premarcado, obligatorio por RGPD */}
      <div className={`flex items-start gap-3 rounded-marca p-3 ${consentError ? 'bg-red-50 border border-red-200' : 'bg-papel'}`}>
        <input
          type="checkbox" id="consent"
          checked={consent}
          onChange={e => { setConsent(e.target.checked); setConsentError(false) }}
          className="mt-0.5 w-4 h-4 accent-terracota shrink-0 cursor-pointer"
        />
        <label htmlFor="consent" className="text-xs leading-relaxed cursor-pointer text-tinta">
          {t.rich('consent', {
            privacyLink: chunks => (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPrivacy(true) }}
                className="underline hover:text-terracota transition-colors cursor-pointer"
              >
                {chunks}
              </button>
            ),
          })}
        </label>
      </div>
      {consentError && (
        <p className="text-xs text-red-600 -mt-3">{t('consentRequired')}</p>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-marca px-4 py-3">{error}</p>
      )}

      <button
        type="submit" disabled={loading}
        className="py-3 px-6 rounded-marca bg-terracota text-sobre-terracota font-medium text-sm transition-colors self-start disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? t('sending') : t('send')}
      </button>

      <Modal
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title={t('privacyModalTitle')}
        closeLabel={t('closeModal')}
      >
        <PrivacyContent locale={locale} />
      </Modal>

    </form>
  )
}

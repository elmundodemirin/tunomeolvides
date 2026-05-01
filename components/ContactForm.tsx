'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function ContactForm() {
  const t = useTranslations('contact')

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      <div className="rounded-2xl border border-[#8FA785] bg-[#f0f5ef] px-6 py-8 text-center">
        <div className="text-3xl mb-3">✉️</div>
        <p className="font-medium text-[#5F7355]" style={{ fontFamily: 'Georgia, serif' }}>
          {t('successTitle')}
        </p>
        <p className="text-sm text-[#5a3f30] mt-2">{t('successBody')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          {t('name')} <span className="text-[#C9633E]">*</span>
        </label>
        <input
          type="text" name="name" required
          value={form.name} onChange={handleChange}
          placeholder={t('namePlaceholder')}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9633E] focus:border-transparent"
          style={{ borderColor: 'var(--color-cream-dark)', backgroundColor: 'white' }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          {t('email')} <span className="text-[#C9633E]">*</span>
        </label>
        <input
          type="email" name="email" required
          value={form.email} onChange={handleChange}
          placeholder={t('emailPlaceholder')}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9633E] focus:border-transparent"
          style={{ borderColor: 'var(--color-cream-dark)', backgroundColor: 'white' }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          {t('message')} <span className="text-[#C9633E]">*</span>
        </label>
        <textarea
          name="message" required
          value={form.message} onChange={handleChange}
          placeholder={t('messagePlaceholder')} rows={5}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9633E] focus:border-transparent resize-none"
          style={{ borderColor: 'var(--color-cream-dark)', backgroundColor: 'white' }}
        />
      </div>

      {/* Consentimiento — NO premarcado, obligatorio por RGPD */}
      <div className={`flex items-start gap-3 rounded-lg p-3 ${consentError ? 'bg-red-50 border border-red-200' : 'bg-[#FAF6EE]'}`}>
        <input
          type="checkbox" id="consent"
          checked={consent}
          onChange={e => { setConsent(e.target.checked); setConsentError(false) }}
          className="mt-0.5 w-4 h-4 accent-[#C9633E] shrink-0 cursor-pointer"
        />
        <label htmlFor="consent" className="text-xs leading-relaxed cursor-pointer" style={{ color: 'var(--color-text)' }}>
          {t.rich('consent', {
            privacyLink: chunks => (
              <a href="/privacidad" className="underline hover:text-[#C9633E] transition-colors">
                {chunks}
              </a>
            ),
          })}
        </label>
      </div>
      {consentError && (
        <p className="text-xs text-red-600 -mt-3">{t('consentRequired')}</p>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>
      )}

      <button
        type="submit" disabled={loading}
        className="py-3 px-6 rounded-lg text-white font-medium text-sm transition-colors self-start disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--color-terracotta)' }}
      >
        {loading ? t('sending') : t('send')}
      </button>

    </form>
  )
}

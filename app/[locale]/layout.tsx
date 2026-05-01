import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Link from 'next/link'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import { CookieBanner } from '@/components/CookieBanner'
import { Footer } from '@/components/Footer'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'nav' })
  const tHeader = await getTranslations({ locale, namespace: 'header' })

  return (
    <NextIntlClientProvider messages={messages}>
      <header style={{ backgroundColor: 'var(--color-terracotta)' }} className="px-6 py-4 flex items-center justify-between">
        <Link href={locale === 'es' ? '/' : '/en'} className="flex items-center gap-3 no-underline">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {[0,72,144,216,288].map((deg) => (
              <ellipse key={deg} cx="14" cy="14" rx="4" ry="8"
                fill="#6B8CB8" opacity="0.9"
                transform={`rotate(${deg} 14 14) translate(0 -5)`}
              />
            ))}
            <circle cx="14" cy="14" r="4" fill="#FAF6EE"/>
            <circle cx="14" cy="14" r="2.5" fill="#6B8CB8"/>
          </svg>
          <div>
            <div className="text-white text-xl leading-tight" style={{ fontFamily: 'Georgia, serif' }}>No Me Olvides</div>
            <div className="text-white/80 text-xs">{tHeader('subtitle')}</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-white/90">
          <Link href={locale === 'es' ? '/' : '/en'} className="hover:text-white transition-colors">{t('home')}</Link>
          <Link href={locale === 'es' ? '/sobre' : '/en/about'} className="hover:text-white transition-colors">{t('about')}</Link>
          <Link href={locale === 'es' ? '/contacto' : '/en/contact'} className="hover:text-white transition-colors">{t('contact')}</Link>
          <LocaleSwitcher />
        </nav>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer locale={locale} />
      <CookieBanner locale={locale} />
    </NextIntlClientProvider>
  )
}

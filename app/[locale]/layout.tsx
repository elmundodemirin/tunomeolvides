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

  // URLs por idioma (ES sin prefijo, EN/FR con prefijo y slug traducido)
  const homeHref = locale === 'es' ? '/' : `/${locale}`
  const aboutHref =
    locale === 'es' ? '/sobre' : locale === 'fr' ? '/fr/a-propos' : '/en/about'
  const contactHref =
    locale === 'es' ? '/contacto' : locale === 'fr' ? '/fr/contact' : '/en/contact'

  return (
    <NextIntlClientProvider messages={messages}>
      <header
        className="px-6 py-3.5 flex items-center justify-between sticky top-0 z-30"
        style={{
          backgroundColor: 'var(--color-terracotta-dark)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
        }}
      >
        <Link href={homeHref} className="flex items-center gap-3 no-underline">
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
            <div
              className="text-lg leading-tight text-white"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              No Me Olvides
            </div>
            <div className="text-[11px] text-white/75">
              {tHeader('subtitle')}
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-5 text-sm text-white/85">
          <Link href={homeHref} className="transition-colors hover:text-white">
            {t('home')}
          </Link>
          <Link href={aboutHref} className="transition-colors hover:text-white">
            {t('about')}
          </Link>
          <Link href={contactHref} className="transition-colors hover:text-white">
            {t('contact')}
          </Link>
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

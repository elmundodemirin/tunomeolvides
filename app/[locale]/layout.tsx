import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Link from 'next/link'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import { CookieBanner } from '@/components/CookieBanner'
import { Footer } from '@/components/Footer'
import Image from 'next/image'
import { MobileMenu } from '@/components/MobileMenu'

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

  // URLs por idioma (ES sin prefijo, EN/FR con prefijo y slug traducido)
  const homeHref = locale === 'es' ? '/' : `/${locale}`
  const aboutHref =
    locale === 'es' ? '/sobre' : locale === 'fr' ? '/fr/a-propos' : '/en/about'
  const contactHref =
    locale === 'es' ? '/contacto' : locale === 'fr' ? '/fr/contact' : '/en/contact'
  // "Para ayuntamientos" solo existe en español (público objetivo: ayuntamientos españoles)
  const isEs = locale === 'es'

  return (
    <NextIntlClientProvider messages={messages}>
      <header
        className="px-6 py-2.5 flex items-center justify-between sticky top-0 z-30"
        style={{
          backgroundColor: 'var(--color-cream)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
        }}
      >
        <Link href={homeHref} className="flex items-center gap-3 no-underline">
          {/* Logo como "insignia": tarjeta con su propio fondo crema (el de la
              imagen), separada del header con sombra, en vez de forzar un
              recorte/transparencia que no tenemos. */}
          <span
            className="block rounded-lg overflow-hidden shrink-0"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)', border: '1px solid var(--color-cream-dark)' }}
          >
            <Image
              src="/logo-tunomeolvides.jpg"
              alt="Tú no me olvides"
              width={180}
              height={115}
              priority
              className="block h-11 w-auto lg:h-14"
            />
          </span>
        </Link>

        <nav className="flex items-center gap-3 lg:gap-5 text-sm" style={{ color: 'var(--color-text)' }}>
          {/* Links inline solo en escritorio */}
          <Link href={homeHref} className="hidden lg:inline-block transition-colors hover:opacity-70">
            {t('home')}
          </Link>
          <Link href={aboutHref} className="hidden lg:inline-block transition-colors hover:opacity-70">
            {t('about')}
          </Link>
          {isEs && (
            <Link href="/ayuntamientos" className="hidden lg:inline-block transition-colors hover:opacity-70">
              Para ayuntamientos
            </Link>
          )}
          <Link href={contactHref} className="hidden lg:inline-block transition-colors hover:opacity-70">
            {t('contact')}
          </Link>

          <LocaleSwitcher />

          {/* Hamburguesa + drawer solo en móvil */}
          <MobileMenu
            className="lg:hidden"
            items={[
              { href: homeHref, label: t('home') },
              { href: aboutHref, label: t('about') },
              ...(isEs ? [{ href: '/ayuntamientos', label: 'Para ayuntamientos' }] : []),
              { href: contactHref, label: t('contact') },
            ]}
          />
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

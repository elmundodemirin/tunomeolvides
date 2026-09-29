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
          backgroundColor: 'var(--color-papel)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
        }}
      >
        <Link href={homeHref} className="flex items-center gap-3 no-underline">
          {/* Solo el emblema del pueblo (sin el texto "Tú no me olvides" ni
              la franja inferior de la imagen original, recortada con
              object-position). Fondo de la imagen ya es prácticamente el
              mismo crema del header, así que no necesita tarjeta propia. */}
          <span className="block relative overflow-hidden shrink-0 h-11 w-[116px] lg:h-14 lg:w-[148px]">
            <Image
              src="/logo-tunomeolvides.png"
              alt="Tú no me olvides"
              fill
              priority
              className="object-cover object-top"
            />
          </span>
        </Link>

        <nav className="flex items-center gap-3 lg:gap-5 text-xs">
          {/* Links inline solo en escritorio — etiquetas/menú: mayúsculas espaciadas en dorado-lema */}
          <Link href={homeHref} className="label-marca hidden lg:inline-block transition-opacity hover:opacity-70">
            {t('home')}
          </Link>
          <Link href={aboutHref} className="label-marca hidden lg:inline-block transition-opacity hover:opacity-70">
            {t('about')}
          </Link>
          {isEs && (
            <Link href="/ayuntamientos" className="label-marca hidden lg:inline-block transition-opacity hover:opacity-70">
              Para ayuntamientos
            </Link>
          )}
          <Link href={contactHref} className="label-marca hidden lg:inline-block transition-opacity hover:opacity-70">
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

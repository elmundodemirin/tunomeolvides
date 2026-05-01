import Link from 'next/link'
import { ManageCookiesButton } from '@/components/ManageCookiesButton'

type Props = { locale: string }

const LINKS_BY_LOCALE: Record<string, { href: string; label: string }[]> = {
  es: [
    { href: '/aviso-legal', label: 'Aviso legal' },
    { href: '/privacidad', label: 'Política de privacidad' },
    { href: '/politica-de-cookies', label: 'Política de cookies' },
  ],
  en: [
    { href: '/en/legal-notice', label: 'Legal notice' },
    { href: '/en/privacy-policy', label: 'Privacy policy' },
    { href: '/en/cookie-policy', label: 'Cookie policy' },
  ],
  fr: [
    { href: '/fr/mentions-legales', label: 'Mentions légales' },
    { href: '/fr/politique-de-confidentialite', label: 'Politique de confidentialité' },
    { href: '/fr/politique-cookies', label: 'Politique relative aux cookies' },
  ],
}

const STRINGS: Record<string, { manage: string; navAria: string; rights: (year: number) => string }> = {
  es: {
    manage: 'Gestionar cookies',
    navAria: 'Avisos legales',
    rights: (year) => `© ${year} No Me Olvides · Todos los derechos reservados`,
  },
  en: {
    manage: 'Manage cookies',
    navAria: 'Legal',
    rights: (year) => `© ${year} No Me Olvides · All rights reserved`,
  },
  fr: {
    manage: 'Gérer les cookies',
    navAria: 'Mentions légales',
    rights: (year) => `© ${year} No Me Olvides · Tous droits réservés`,
  },
}

export function Footer({ locale }: Props) {
  const links = LINKS_BY_LOCALE[locale] ?? LINKS_BY_LOCALE.es
  const strings = STRINGS[locale] ?? STRINGS.es

  return (
    <footer className="border-t border-[#EFE8D6] bg-[#FAF6EE] mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5a3f30]">
        <span>{strings.rights(new Date().getFullYear())}</span>
        <nav className="flex flex-wrap items-center gap-4" aria-label={strings.navAria}>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#8E4226] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <ManageCookiesButton label={strings.manage} />
        </nav>
      </div>
    </footer>
  )
}

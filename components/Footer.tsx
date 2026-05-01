import Link from 'next/link'
import { ManageCookiesButton } from '@/components/ManageCookiesButton'

type Props = { locale: string }

export function Footer({ locale }: Props) {
  const isEn = locale === 'en'
  const base = isEn ? '/en' : ''

  const links = isEn
    ? [
        { href: `${base}/legal-notice`, label: 'Legal notice' },
        { href: `${base}/privacy-policy`, label: 'Privacy policy' },
        { href: `${base}/cookie-policy`, label: 'Cookie policy' },
      ]
    : [
        { href: `${base}/aviso-legal`, label: 'Aviso legal' },
        { href: `${base}/privacidad`, label: 'Política de privacidad' },
        { href: `${base}/politica-de-cookies`, label: 'Política de cookies' },
      ]

  const manageCookiesLabel = isEn ? 'Manage cookies' : 'Gestionar cookies'
  const rights = isEn
    ? `© ${new Date().getFullYear()} No Me Olvides · All rights reserved`
    : `© ${new Date().getFullYear()} No Me Olvides · Todos los derechos reservados`

  return (
    <footer className="border-t border-[#EFE8D6] bg-[#FAF6EE] mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a07860]">
        <span>{rights}</span>
        <nav className="flex flex-wrap items-center gap-4">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#C9633E] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <ManageCookiesButton label={manageCookiesLabel} />
        </nav>
      </div>
    </footer>
  )
}

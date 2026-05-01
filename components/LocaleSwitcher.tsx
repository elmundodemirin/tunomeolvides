'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

const LOCALES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
] as const

type LocaleCode = (typeof LOCALES)[number]['code']

// Mapeo entre slugs equivalentes en distintos idiomas. Las claves son los
// pathnames que devuelve next-intl (sin prefijo de locale). Un pathname ausente
// implica caer al home del idioma destino.
const PATH_EQUIVALENTS: Record<string, Partial<Record<LocaleCode, string>>> = {
  '/sobre':                          { en: '/about',                       fr: '/a-propos' },
  '/about':                          { es: '/sobre',                       fr: '/a-propos' },
  '/a-propos':                       { es: '/sobre',                       en: '/about' },
  '/contacto':                       { en: '/contact',                     fr: '/contact' },
  '/contact':                        { es: '/contacto',                    fr: '/contact' },
  '/aviso-legal':                    { en: '/legal-notice',                fr: '/mentions-legales' },
  '/legal-notice':                   { es: '/aviso-legal',                 fr: '/mentions-legales' },
  '/mentions-legales':               { es: '/aviso-legal',                 en: '/legal-notice' },
  '/privacidad':                     { en: '/privacy-policy',              fr: '/politique-de-confidentialite' },
  '/privacy-policy':                 { es: '/privacidad',                  fr: '/politique-de-confidentialite' },
  '/politique-de-confidentialite':   { es: '/privacidad',                  en: '/privacy-policy' },
  '/politica-de-cookies':            { en: '/cookie-policy',               fr: '/politique-cookies' },
  '/cookie-policy':                  { es: '/politica-de-cookies',         fr: '/politique-cookies' },
  '/politique-cookies':              { es: '/politica-de-cookies',         en: '/cookie-policy' },
}

function mapPath(currentPath: string, target: LocaleCode): string {
  if (currentPath === '/') return '/'
  return PATH_EQUIVALENTS[currentPath]?.[target] ?? '/'
}

export default function LocaleSwitcher() {
  const currentLocale = useLocale() as LocaleCode
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleSelect = (code: LocaleCode) => {
    setOpen(false)
    if (code === currentLocale) return
    const target = mapPath(pathname, code)
    router.replace(target, { locale: code })
  }

  return (
    <div ref={containerRef} className="relative ml-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1 rounded border border-white/40 text-xs hover:bg-white/10 transition-colors uppercase text-white"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Idioma actual: ${currentLocale.toUpperCase()}`}
      >
        {currentLocale}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M2 4L5 7L8 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 min-w-[140px] bg-white rounded-lg shadow-lg border overflow-hidden z-50 text-sm"
          style={{ borderColor: 'var(--color-cream-dark)' }}
        >
          {LOCALES.map(({ code, label }) => {
            const isCurrent = code === currentLocale
            return (
              <li key={code} role="option" aria-selected={isCurrent}>
                <button
                  type="button"
                  onClick={() => handleSelect(code)}
                  className="w-full text-left px-3 py-2 transition-colors hover:bg-[color:var(--color-cream)] flex items-center gap-2"
                  style={{
                    color: 'var(--color-text)',
                    backgroundColor: isCurrent ? 'var(--color-cream)' : undefined,
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                >
                  <span
                    className="uppercase text-xs font-mono w-6"
                    style={{ color: 'var(--color-terracotta-dark)' }}
                  >
                    {code}
                  </span>
                  <span>{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

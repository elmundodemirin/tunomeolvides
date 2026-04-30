'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname() // returns path WITHOUT locale prefix

  function switchLocale() {
    const next = locale === 'es' ? 'en' : 'es'
    router.replace(pathname, { locale: next })
  }

  const nextLocale = locale === 'es' ? 'en' : 'es'

  return (
    <button
      onClick={switchLocale}
      className="ml-2 px-2 py-1 rounded border border-white/40 text-xs hover:bg-white/10 transition-colors uppercase text-white"
      aria-label={`Switch to ${nextLocale}`}
    >
      {locale}
    </button>
  )
}

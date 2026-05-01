'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

type Item = { href: string; label: string }

type Props = {
  items: Item[]
  className?: string
}

// Drawer móvil que se desliza desde la derecha al pulsar la hamburguesa.
// Backdrop oscuro detrás, Esc cierra, click fuera cierra, scroll del body
// bloqueado mientras está abierto. z-[1001] para quedar siempre por encima
// del mapa (Leaflet panes llegan a z-700) y del botón flotante (z-[1000]).
export function MobileMenu({ items, className = '' }: Props) {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`p-1 -mr-1 rounded text-white hover:bg-white/10 transition-colors ${className}`}
        aria-label={t('openMenu')}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[1000] bg-black/40 transition-opacity duration-300 ${className} ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[1001] flex flex-col w-[min(320px,80vw)] transition-transform duration-300 ease-out ${className}`}
        style={{
          backgroundColor: 'var(--color-terracotta-dark)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-8px 0 24px rgba(0,0,0,0.25)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={t('menu')}
        inert={!open}
      >
        <header
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
        >
          <h2
            className="text-lg leading-tight text-white"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {t('menu')}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('closeMenu')}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <nav className="flex-1 overflow-y-auto py-2" aria-label={t('menu')}>
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-4 text-white text-base hover:bg-white/10 transition-colors"
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

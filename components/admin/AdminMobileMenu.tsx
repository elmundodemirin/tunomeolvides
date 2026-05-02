'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SignOutButton } from '@/components/admin/SignOutButton'

type Item = { href: string; label: string }

type Props = {
  items: Item[]
  userEmail: string
  className?: string
}

// Drawer móvil para el panel admin. Mismo patrón que MobileMenu del sitio
// público pero con la paleta marrón oscura del admin (#3d2b1f) y un pie con
// el email del usuario y el botón de cerrar sesión.
export function AdminMobileMenu({ items, userEmail, className = '' }: Props) {
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`p-2 rounded text-[#FAF6EE] hover:bg-[#5a3f30] transition-colors ${className}`}
        aria-label="Abrir menú"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-[1000] bg-black/40 transition-opacity duration-300 ${className} ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 bottom-0 z-[1001] flex flex-col w-[min(280px,82vw)] bg-[#3d2b1f] transition-transform duration-300 ease-out ${className}`}
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-8px 0 24px rgba(0,0,0,0.3)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de administración"
        inert={!open}
      >
        <header className="px-5 py-4 shrink-0 border-b border-[#5a3f30] flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xl mb-1">✿</div>
            <div
              className="text-[#FAF6EE] text-sm font-bold"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              No Me Olvides
            </div>
            <p className="text-[#a07860] text-xs mt-0.5">Panel de administración</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-full text-[#FAF6EE] hover:bg-[#5a3f30] transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Navegación">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-[#EFE8D6] hover:bg-[#5a3f30] rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[#5a3f30] shrink-0">
          <p className="px-4 text-xs text-[#a07860] truncate mb-2">{userEmail}</p>
          <SignOutButton />
        </div>
      </aside>
    </>
  )
}

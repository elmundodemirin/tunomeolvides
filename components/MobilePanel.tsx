'use client'

import { useEffect, useState, type ReactNode } from 'react'

type Props = {
  buttonLabel: string
  panelTitle: string
  closeLabel?: string
  children: ReactNode
  className?: string
}

// Patrón "botón flotante + panel pantalla completa" para móvil.
// El botón vive a z-[1000] y el panel a z-[1001], por encima del z-700
// que Leaflet usa para sus popups. Así no hay conflictos de stacking.
export function MobilePanel({
  buttonLabel,
  panelTitle,
  closeLabel = 'Cerrar',
  children,
  className = '',
}: Props) {
  const [open, setOpen] = useState(false)

  // Bloquear scroll del body y permitir cerrar con Esc cuando está abierto
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      {/* Botón flotante (centrado abajo) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 px-5 py-3 rounded-full shadow-xl transition-transform active:scale-95 ${className}`}
        style={{
          backgroundColor: 'var(--color-terracotta)',
          color: 'white',
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-semibold">{buttonLabel}</span>
      </button>

      {/* Panel pantalla completa que sube desde abajo */}
      <div
        className={`fixed inset-0 z-[1001] flex flex-col transition-transform duration-300 ease-out ${className}`}
        style={{
          backgroundColor: 'var(--color-cream)',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={panelTitle}
        inert={!open}
      >
        <header
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--color-cream-dark)' }}
        >
          <h2
            className="text-lg leading-tight"
            style={{ fontFamily: 'Georgia, serif', color: 'var(--color-terracotta-dark)' }}
          >
            {panelTitle}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={closeLabel}
            className="w-9 h-9 inline-flex items-center justify-center rounded-full text-2xl leading-none transition-colors hover:bg-[color:var(--color-cream-dark)]"
            style={{ color: 'var(--color-text)' }}
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {children}
        </div>
      </div>
    </>
  )
}

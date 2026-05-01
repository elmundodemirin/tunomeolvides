'use client'

import { useState, type ReactNode } from 'react'

type Props = {
  title: string
  badge?: string
  children: ReactNode
  className?: string
}

// Estado colapsado: solo asoma la cabecera del bottom sheet (HANDLE_PX por arriba).
// Estado expandido: ocupa SHEET_VH del viewport, dejando el mapa visible por encima.
const HANDLE_PX = 72
const SHEET_VH = 78

export function BottomSheet({ title, badge, children, className = '' }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Backdrop sutil cuando está abierto: deja ver el mapa pero ayuda a pulsar fuera para cerrar */}
      {open && (
        <div
          className={`fixed inset-0 z-10 bg-black/15 transition-opacity ${className}`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed left-0 right-0 bottom-0 z-20 flex flex-col rounded-t-2xl shadow-[0_-8px_24px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out ${className}`}
        style={{
          backgroundColor: 'var(--color-cream)',
          height: `${SHEET_VH}vh`,
          transform: open ? 'translateY(0)' : `translateY(calc(${SHEET_VH}vh - ${HANDLE_PX}px))`,
        }}
        role="region"
        aria-label={title}
      >
        {/* Tirador visual centrado */}
        <div
          aria-hidden="true"
          className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full"
          style={{ backgroundColor: 'var(--color-cream-dark)' }}
        />

        {/* Cabecera (botón que abre/cierra) */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="flex items-center justify-between px-5 pt-5 pb-3 text-left"
          style={{ height: `${HANDLE_PX}px` }}
        >
          <div className="flex flex-col items-start min-w-0">
            {badge && (
              <span
                className="text-[10px] uppercase tracking-wider font-semibold mb-0.5"
                style={{ color: 'var(--color-sage-dark)' }}
              >
                {badge}
              </span>
            )}
            <span
              className="text-base leading-tight truncate"
              style={{ fontFamily: 'Georgia, serif', color: 'var(--color-terracotta-dark)' }}
            >
              {title}
            </span>
          </div>
          <span
            className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            style={{ color: 'var(--color-terracotta-dark)' }}
            aria-hidden="true"
          >
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M5 12L10 7L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {/* Cuerpo expandible: scrollable */}
        <div className="flex-1 overflow-y-auto px-5 pb-8">
          {children}
        </div>
      </div>
    </>
  )
}

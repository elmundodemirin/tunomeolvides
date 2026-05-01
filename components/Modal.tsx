'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  closeLabel?: string
}

export function Modal({ open, onClose, title, children, closeLabel = 'Cerrar' }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    // Bloquear scroll del body mientras el modal está abierto
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        <header
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-cream-dark)' }}
        >
          <h2
            id="modal-title"
            className="text-xl"
            style={{ fontFamily: 'Georgia, serif', color: 'var(--color-terracotta-dark)' }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full text-xl leading-none transition-colors hover:bg-[color:var(--color-cream-dark)]"
            style={{ color: 'var(--color-text)' }}
          >
            ×
          </button>
        </header>
        <div className="overflow-y-auto px-6 py-6">
          <div className="prose-legal">{children}</div>
        </div>
      </div>
    </div>
  )
}

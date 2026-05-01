'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Locality } from '@/lib/types'
import LocalityList from './LocalityList'
import MapWrapper from './MapWrapper'

type Props = {
  localities: Locality[]
  locale: string
}

export default function HomeShell({ localities, locale }: Props) {
  const t = useTranslations('home')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusToken, setFocusToken] = useState(0)

  // Click en la misma localidad → deselecciona (mapa vuelve a vista por defecto).
  // El token siempre se incrementa para que el mapa reaccione aunque la id no cambie.
  const handleSelect = (id: string) => {
    setSelectedId((current) => (current === id ? null : id))
    setFocusToken((n) => n + 1)
  }

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-72px)]">
      {/* Panel narrativo + lista */}
      <aside
        className="lg:w-2/5 lg:max-w-[480px] lg:overflow-y-auto px-6 py-8 lg:px-10 lg:py-12 flex flex-col"
        style={{ backgroundColor: 'var(--color-cream)' }}
      >
        <header className="mb-6">
          <h1
            className="text-3xl lg:text-4xl leading-tight mb-3"
            style={{ fontFamily: 'Georgia, serif', color: 'var(--color-terracotta-dark)' }}
          >
            {t('title')}
          </h1>
          <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--color-text)' }}>
            {t('lead')}
          </p>
          <div
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: 'var(--color-sage-dark)' }}
          >
            {t('localitiesCount', { count: localities.length })}
          </div>
        </header>

        <LocalityList
          localities={localities}
          locale={locale}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </aside>

      {/* Mapa: tarjeta con borde redondeado y sombra en escritorio */}
      <div className="h-[60vh] lg:h-auto lg:flex-1 lg:w-3/5 lg:p-6">
        <div className="h-full w-full lg:overflow-hidden lg:rounded-2xl lg:shadow-lg">
          <MapWrapper
            localities={localities}
            locale={locale}
            selectedId={selectedId}
            focusToken={focusToken}
          />
        </div>
      </div>
    </div>
  )
}

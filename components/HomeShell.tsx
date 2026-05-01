'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Locality } from '@/lib/types'
import LocalityList from './LocalityList'
import MapWrapper from './MapWrapper'
import { MobilePanel } from './MobilePanel'

type Props = {
  localities: Locality[]
  locale: string
}

export default function HomeShell({ localities, locale }: Props) {
  const t = useTranslations('home')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusToken, setFocusToken] = useState(0)

  // Click en la misma localidad → deselecciona (mapa vuelve a vista por defecto).
  const handleSelect = (id: string) => {
    setSelectedId((current) => (current === id ? null : id))
    setFocusToken((n) => n + 1)
  }

  // Contenido común del panel — usado tanto en el sidebar de escritorio
  // como dentro del bottom sheet en móvil. La lista mantiene el mismo estado
  // (selectedId / focusToken) entre ambos.
  const panel = (
    <>
      <div className="mb-6">
        <h1
          className="text-2xl lg:text-4xl leading-tight mb-3"
          style={{ fontFamily: 'Georgia, serif', color: 'var(--color-terracotta-dark)' }}
        >
          {t('title')}
        </h1>
        <p className="text-sm lg:text-base leading-relaxed mb-4" style={{ color: 'var(--color-text)' }}>
          {t('lead')}
        </p>
        <div
          className="text-xs uppercase tracking-wider font-semibold"
          style={{ color: 'var(--color-sage-dark)' }}
        >
          {t('localitiesCount', { count: localities.length })}
        </div>
      </div>

      <LocalityList
        localities={localities}
        locale={locale}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
    </>
  )

  return (
    <div className="relative h-[calc(100dvh-72px)] lg:flex lg:h-[calc(100vh-72px)]">
      {/* Sidebar narrativo: solo visible en lg+ */}
      <aside
        className="hidden lg:flex lg:w-2/5 lg:max-w-[480px] lg:overflow-y-auto px-6 py-8 lg:px-10 lg:py-12 flex-col"
        style={{ backgroundColor: 'var(--color-cream)' }}
      >
        {panel}
      </aside>

      {/* Mapa: pantalla completa en móvil, columna derecha en desktop con tarjeta */}
      <div className="h-full w-full lg:flex-1 lg:w-3/5 lg:p-6">
        <div className="h-full w-full lg:overflow-hidden lg:rounded-2xl lg:shadow-lg">
          <MapWrapper
            localities={localities}
            locale={locale}
            selectedId={selectedId}
            focusToken={focusToken}
          />
        </div>
      </div>

      {/* Botón flotante + panel pantalla completa: solo móvil */}
      <MobilePanel
        buttonLabel={t('localitiesHeading')}
        panelTitle={t('title')}
        className="lg:hidden"
      >
        {panel}
      </MobilePanel>
    </div>
  )
}

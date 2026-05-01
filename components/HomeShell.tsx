'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Locality } from '@/lib/types'
import LocalityList from './LocalityList'
import MapWrapper from './MapWrapper'
import { MobilePanel } from './MobilePanel'
import { Filters } from './Filters'

type Props = {
  localities: Locality[]
  locale: string
}

export default function HomeShell({ localities, locale }: Props) {
  const t = useTranslations('home')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [focusToken, setFocusToken] = useState(0)

  // Filtros
  const [search, setSearch] = useState('')
  const [comunidad, setComunidad] = useState('')
  const [provincia, setProvincia] = useState('')

  // Click en la misma localidad → deselecciona (mapa vuelve a vista por defecto).
  const handleSelect = (id: string) => {
    setSelectedId((current) => (current === id ? null : id))
    setFocusToken((n) => n + 1)
  }

  // Listas de opciones para los desplegables.
  // Las provincias se filtran por la comunidad seleccionada — así si eliges
  // "Aragón" solo aparecen Teruel/Zaragoza/Huesca.
  const comunidadOptions = useMemo(
    () => [...new Set(localities.map((l) => l.region))].sort((a, b) => a.localeCompare(b, 'es')),
    [localities],
  )

  const provinciaOptions = useMemo(() => {
    const source = comunidad ? localities.filter((l) => l.region === comunidad) : localities
    return [...new Set(source.map((l) => l.province))].sort((a, b) => a.localeCompare(b, 'es'))
  }, [localities, comunidad])

  // Si la provincia activa deja de ser válida tras cambiar la comunidad, se resetea
  useEffect(() => {
    if (provincia && !provinciaOptions.includes(provincia)) {
      setProvincia('')
    }
  }, [provinciaOptions, provincia])

  // Lista filtrada
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return localities.filter((l) => {
      if (q && !l.name.toLowerCase().includes(q)) return false
      if (comunidad && l.region !== comunidad) return false
      if (provincia && l.province !== provincia) return false
      return true
    })
  }, [localities, search, comunidad, provincia])

  // Si la localidad seleccionada se filtra fuera, limpia la selección
  useEffect(() => {
    if (selectedId && !filtered.some((l) => l.id === selectedId)) {
      setSelectedId(null)
    }
  }, [filtered, selectedId])

  const hasActiveFilters = search.trim() !== '' || comunidad !== '' || provincia !== ''

  const handleClearFilters = () => {
    setSearch('')
    setComunidad('')
    setProvincia('')
  }

  // Contenido del panel: cabecera + filtros + lista (o mensaje vacío)
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
          {t('localitiesCount', { count: filtered.length })}
        </div>
      </div>

      <Filters
        search={search}
        onSearchChange={setSearch}
        comunidad={comunidad}
        onComunidadChange={setComunidad}
        provincia={provincia}
        onProvinciaChange={setProvincia}
        comunidadOptions={comunidadOptions}
        provinciaOptions={provinciaOptions}
        onClear={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filtered.length === 0 ? (
        <p className="text-sm py-4" style={{ color: 'var(--color-sage-dark)' }}>
          {t('noResults')}
        </p>
      ) : (
        <LocalityList
          localities={filtered}
          locale={locale}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      )}
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
      <div
        className="h-full w-full lg:flex-1 lg:w-3/5 lg:p-6"
        role="application"
        aria-label={t('mapAriaLabel')}
      >
        <div className="h-full w-full lg:overflow-hidden lg:rounded-2xl lg:shadow-lg">
          <MapWrapper
            localities={filtered}
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

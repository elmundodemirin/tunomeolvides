'use client'

import { useTranslations } from 'next-intl'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  comunidad: string
  onComunidadChange: (v: string) => void
  provincia: string
  onProvinciaChange: (v: string) => void
  comunidadOptions: string[]
  provinciaOptions: string[]
  onClear: () => void
  hasActiveFilters: boolean
}

export function Filters({
  search,
  onSearchChange,
  comunidad,
  onComunidadChange,
  provincia,
  onProvinciaChange,
  comunidadOptions,
  provinciaOptions,
  onClear,
  hasActiveFilters,
}: Props) {
  const t = useTranslations('home')

  const inputBase =
    'w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--color-terracotta)] focus:border-transparent'

  return (
    <div className="flex flex-col gap-2 mb-4">
      <input
        type="search"
        placeholder={t('filterSearch')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={inputBase}
        style={{ borderColor: 'var(--color-cream-dark)' }}
        aria-label={t('filterSearch')}
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          value={comunidad}
          onChange={(e) => onComunidadChange(e.target.value)}
          className={inputBase}
          style={{ borderColor: 'var(--color-cream-dark)' }}
          aria-label={t('filterComunidad')}
        >
          <option value="">{t('filterComunidad')}</option>
          {comunidadOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={provincia}
          onChange={(e) => onProvinciaChange(e.target.value)}
          className={inputBase}
          style={{ borderColor: 'var(--color-cream-dark)' }}
          aria-label={t('filterProvincia')}
        >
          <option value="">{t('filterProvincia')}</option>
          {provinciaOptions.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="self-start text-xs underline transition-colors mt-1"
          style={{ color: 'var(--color-terracotta)' }}
        >
          {t('filterClear')}
        </button>
      )}
    </div>
  )
}

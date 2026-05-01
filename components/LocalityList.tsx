'use client'

import type { Locality } from '@/lib/types'

type Props = {
  localities: Locality[]
  locale: string
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function LocalityList({ localities, locale, selectedId, onSelect }: Props) {
  if (localities.length === 0) return null

  return (
    <ul className="flex flex-col gap-2">
      {localities.map((loc) => {
        // FR cae al audio inglés (no hay contenido FR en BD)
        const hasAudio =
          locale === 'en' || locale === 'fr' ? !!loc.audio_url_en : !!loc.audio_url_es
        const isSelected = selectedId === loc.id
        return (
          <li key={loc.id}>
            <button
              type="button"
              onClick={() => onSelect(loc.id)}
              className="w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2"
              style={{
                backgroundColor: isSelected ? 'var(--color-terracotta)' : 'white',
                borderColor: isSelected ? 'var(--color-terracotta-dark)' : 'var(--color-cream-dark)',
                color: isSelected ? 'white' : 'var(--color-text)',
              }}
              aria-pressed={isSelected}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div
                    className="text-base mb-0.5 truncate"
                    style={{ fontFamily: 'Georgia, serif', fontWeight: 600 }}
                  >
                    {loc.name}
                  </div>
                  <div className="text-xs truncate" style={{ opacity: 0.75 }}>
                    {loc.province} · {loc.region}
                  </div>
                </div>
                {hasAudio && (
                  <span
                    className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full text-sm"
                    style={{
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.22)' : 'var(--color-cream-dark)',
                      color: isSelected ? 'white' : 'var(--color-sage-dark)',
                    }}
                    aria-label="Audio"
                    title="Audio"
                  >
                    ♪
                  </span>
                )}
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

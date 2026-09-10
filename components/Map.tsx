'use client'

import { useEffect, useRef } from 'react'
import type { Locality } from '@/lib/types'
import { pickLocalized } from '@/lib/locality'
import 'leaflet/dist/leaflet.css'

type Props = {
  localities: Locality[]
  locale: string
  selectedId?: string | null
  focusToken?: number
}

const DEFAULT_CENTER: [number, number] = [40.4, -3.7]
const DEFAULT_ZOOM = 6

// SVG pin with forget-me-not flower color (sized 36x44 for accessible touch target)
const MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 28 36" aria-hidden="true">
  <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
        fill="#6B8CB8" stroke="#4a6a96" stroke-width="1.5"/>
  <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
  <circle cx="14" cy="14" r="3" fill="#6B8CB8"/>
</svg>`

const MORE_INFO_LABEL: Record<string, string> = {
  es: 'Más información',
  en: 'More information',
  fr: 'Plus d’informations',
}

function buildPopupHTML(loc: Locality, locale: string): string {
  const description = pickLocalized(locale, loc.description_es, loc.description_en)
  const audioUrl = pickLocalized(locale, loc.audio_url_es, loc.audio_url_en)
  const moreInfoLabel = MORE_INFO_LABEL[locale] ?? MORE_INFO_LABEL.es

  const audioSection = audioUrl
    ? `<div style="padding:4px 14px 8px">
         <audio controls preload="metadata" style="width:100%">
           <source src="${audioUrl}" type="audio/mpeg"/>
         </audio>
       </div>`
    : ''

  const linkSection = loc.external_url
    ? `<div style="padding:4px 12px 12px">
         <a href="${loc.external_url}" target="_blank" rel="noopener noreferrer"
            style="font-size:12px;color:#8E4226;text-decoration:underline">
           ${moreInfoLabel} →
         </a>
       </div>`
    : ''

  return `
    <div>
      <div style="background:#C9633E;padding:12px 14px">
        <strong style="color:white;font-family:Georgia,serif;font-size:16px">${loc.name}</strong>
        <div style="color:rgba(255,255,255,0.85);font-size:11px;margin-top:3px">${loc.province} · ${loc.region}</div>
      </div>
      <div style="padding:12px 14px;font-size:14px;line-height:1.55;color:#2C1810">
        ${description}
      </div>
      ${audioSection}
      ${linkSection}
    </div>`
}

export default function LeafletMap({ localities, locale, selectedId, focusToken = 0 }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef<Record<string, import('leaflet').Marker>>({})

  // Init del mapa una sola vez (cleanup solo al desmontar el componente).
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current = {}
      }
    }
  }, [])

  // Reacciona a cambios en la lista (filtros) y al locale: si el mapa aún no
  // existe lo crea; en cualquier caso, reemplaza los markers y reencuadra
  // automáticamente según el número de resultados.
  useEffect(() => {
    if (!mapRef.current) return
    let cancelled = false

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current) return

      let map = mapInstanceRef.current
      if (!map) {
        map = L.map(mapRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM)
        mapInstanceRef.current = map

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
          // Sirve tiles 2× en pantallas retina/HiDPI: mejor nitidez en móvil
          // y resuelve el aviso "Serves images with low resolution" de Lighthouse.
          detectRetina: true,
        }).addTo(map)
      }

      // Limpia markers anteriores
      Object.values(markersRef.current).forEach((m) => m.remove())
      markersRef.current = {}

      const icon = L.divIcon({
        html: MARKER_SVG,
        className: '',
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -44],
      })

      localities.forEach((loc) => {
        const marker = L.marker([loc.latitude, loc.longitude], {
          icon,
          alt: loc.name,
          title: loc.name,
        })
          .addTo(map!)
          .bindPopup(buildPopupHTML(loc, locale), { maxWidth: 340 })

        // Leaflet hace el div del marker focusable (tabindex=0) pero no le pone
        // un nombre accesible. Sin esto los lectores de pantalla y Lighthouse
        // se quejan: "elements do not have accessible names".
        const el = marker.getElement()
        if (el) {
          el.setAttribute('aria-label', loc.name)
          el.setAttribute('role', 'button')
        }

        markersRef.current[loc.id] = marker
      })

      // Auto-encuadre según el resultado
      if (localities.length === 0) {
        map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.6 })
      } else if (localities.length === 1) {
        map.flyTo([localities[0].latitude, localities[0].longitude], 9, { duration: 0.6 })
      } else {
        const bounds = L.latLngBounds(
          localities.map((l) => [l.latitude, l.longitude] as [number, number]),
        )
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10, animate: true })
      }
    })

    return () => {
      cancelled = true
    }
  }, [localities, locale])

  // Reacciona a la selección desde la lista. focusToken === 0 significa
  // "todavía no ha habido interacción", así que no pisamos el fitBounds inicial.
  useEffect(() => {
    if (focusToken === 0) return

    const map = mapInstanceRef.current
    if (!map) return

    if (!selectedId) {
      map.closePopup()
      map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.8 })
      return
    }

    const marker = markersRef.current[selectedId]
    if (!marker) return
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 8), { duration: 0.8 })
    marker.openPopup()
  }, [selectedId, focusToken])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}

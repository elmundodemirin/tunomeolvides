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

// Límites de pan/zoom (decisión 2026-10-01, a petición de la promotora):
// el visitante no debe poder alejarse hasta perderse en el mapamundi.
// Cubre península + Baleares con margen; deja fuera Canarias a propósito
// —hoy no hay ninguna localidad allí (ver supabase/seed_test_localities.sql)
// y añadirlas a las mismas bounds obligaría a un recuadro gigante que
// dejaría la península minúscula en la vista por defecto. Si en el futuro
// se añade alguna localidad canaria, revisar este límite entonces.
const SPAIN_BOUNDS: [[number, number], [number, number]] = [
  [35.9, -9.6],
  [43.9, 4.5],
]

// Marcador del mapa: pin con punta (silueta reconocible de "aquí está"),
// con la flor del no-me-olvides en el círculo superior — a petición de la
// promotora (2026-11-10), inspirado en un pin de referencia que mandó.
// Vuelve a la forma de pin tras el cambio a insignia circular del
// 2026-11-04, pero conserva la flor como motivo (no una chincheta genérica).
// El path del pin es la silueta clásica de marcador de mapa (círculo que
// remata en punta), reescalada a un viewBox de 40×40.
const MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
  <path
    d="M20,3.33 C13.55,3.33 8.33,8.55 8.33,15 C8.33,23.75 20,36.67 20,36.67 C20,36.67 31.67,23.75 31.67,15 C31.67,8.55 26.45,3.33 20,3.33 Z"
    fill="var(--color-flower)"
    stroke="var(--color-terracota)"
    stroke-width="1.5"
  />
  <circle cx="20" cy="15" r="7" fill="var(--color-papel)" />
  <g transform="translate(20 15)">
    ${[0, 72, 144, 216, 288]
      .map(
        (deg) =>
          `<ellipse cx="0" cy="0" rx="1.4" ry="2.8" fill="var(--color-flower)" opacity="0.9" transform="rotate(${deg}) translate(0 -1.8)"/>`,
      )
      .join('')}
    <circle cx="0" cy="0" r="1.6" fill="var(--color-papel)"/>
    <circle cx="0" cy="0" r="1" fill="var(--color-flower)"/>
  </g>
</svg>`

// "Descubre {pueblo} →" en vez de un genérico "Más información": usa el
// propio nombre de la localidad, así funciona igual de bien para
// cualquier pueblo nuevo sin necesitar un campo propio en la base de datos.
const DISCOVER_LABEL: Record<string, (name: string) => string> = {
  es: (name) => `Descubre ${name}`,
  en: (name) => `Discover ${name}`,
  fr: (name) => `Découvrez ${name}`,
}

function buildPopupHTML(loc: Locality, locale: string): string {
  const description = pickLocalized(locale, loc.description_es, loc.description_en)
  const audioUrl = pickLocalized(locale, loc.audio_url_es, loc.audio_url_en)
  const moreInfoLabel = (DISCOVER_LABEL[locale] ?? DISCOVER_LABEL.es)(loc.name)

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
            style="font-size:12px;color:var(--color-terracota);text-decoration:underline">
           ${moreInfoLabel} →
         </a>
       </div>`
    : ''

  return `
    <div>
      <div style="background:var(--color-terracota);padding:12px 14px">
        <strong style="color:var(--color-sobre-terracota);font-family:var(--font-heading);font-size:16px">${loc.name}</strong>
        <div style="color:rgba(255,255,255,0.85);font-size:11px;margin-top:3px">${loc.province} · ${loc.region}</div>
      </div>
      <div style="padding:12px 14px;font-size:14px;line-height:1.55;color:var(--color-tinta)">
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
        map = L.map(mapRef.current, {
          maxBounds: SPAIN_BOUNDS,
          maxBoundsViscosity: 1.0,
        }).setView(DEFAULT_CENTER, DEFAULT_ZOOM)
        mapInstanceRef.current = map

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18,
          // Sirve tiles 2× en pantallas retina/HiDPI: mejor nitidez en móvil
          // y resuelve el aviso "Serves images with low resolution" de Lighthouse.
          detectRetina: true,
        }).addTo(map)

        // minZoom dinámico: el nivel exacto en el que SPAIN_BOUNDS llena el
        // contenedor, calculado contra el tamaño real en pantalla — así
        // encaja igual de bien en el mapa de móvil (pantalla completa,
        // estrecho) que en el de escritorio (panel ancho).
        const regionZoom = map.getBoundsZoom(SPAIN_BOUNDS, false)
        map.setMinZoom(Math.floor(regionZoom))
      }

      // Limpia markers anteriores
      Object.values(markersRef.current).forEach((m) => m.remove())
      markersRef.current = {}

      const icon = L.divIcon({
        html: MARKER_SVG,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
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

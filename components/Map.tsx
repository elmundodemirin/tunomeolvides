'use client'

import { useEffect, useRef } from 'react'
import type { Locality } from '@/lib/types'
import 'leaflet/dist/leaflet.css'

type Props = {
  localities: Locality[]
  locale: string
  selectedId?: string | null
  focusToken?: number
}

// SVG pin with forget-me-not flower color
const MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
  <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
        fill="#6B8CB8" stroke="#4a6a96" stroke-width="1.5"/>
  <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
  <circle cx="14" cy="14" r="3" fill="#6B8CB8"/>
</svg>`

function buildPopupHTML(loc: Locality, locale: string): string {
  const description = locale === 'en' ? loc.description_en : loc.description_es
  const audioUrl = locale === 'en' ? loc.audio_url_en : loc.audio_url_es
  const audioSection = audioUrl
    ? `<div style="padding:0 12px 4px">
         <audio controls style="width:100%;height:32px">
           <source src="${audioUrl}" type="audio/mpeg"/>
         </audio>
       </div>`
    : ''

  const linkSection = loc.external_url
    ? `<div style="padding:4px 12px 12px">
         <a href="${loc.external_url}" target="_blank" rel="noopener noreferrer"
            style="font-size:12px;color:#8E4226;text-decoration:underline">
           Más información →
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

export default function LeafletMap({ localities, locale, selectedId, focusToken }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef<Record<string, import('leaflet').Marker>>({})

  useEffect(() => {
    if (!mapRef.current) return

    let cancelled = false
    let map: import('leaflet').Map | null = null

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return

      map = L.map(mapRef.current).setView([40.4, -3.7], 6)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      const icon = L.divIcon({
        html: MARKER_SVG,
        className: '',
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -36],
      })

      localities.forEach((loc) => {
        const marker = L.marker([loc.latitude, loc.longitude], { icon })
          .addTo(map!)
          .bindPopup(buildPopupHTML(loc, locale), { maxWidth: 340 })
        markersRef.current[loc.id] = marker
      })
    })

    return () => {
      cancelled = true
      if (map) {
        map.remove()
        mapInstanceRef.current = null
        markersRef.current = {}
      }
    }
  }, [localities, locale])

  // Reacciona a la selección desde la lista:
  // - Con id: vuela al marker y abre su popup.
  // - Sin id (deselección): vuelve a la vista por defecto y cierra el popup.
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    if (!selectedId) {
      map.closePopup()
      map.flyTo([40.4, -3.7], 6, { duration: 0.8 })
      return
    }
    const marker = markersRef.current[selectedId]
    if (!marker) return
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 8), { duration: 0.8 })
    marker.openPopup()
  }, [selectedId, focusToken])

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}

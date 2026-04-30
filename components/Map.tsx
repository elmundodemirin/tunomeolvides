'use client'

import { useEffect, useRef } from 'react'
import type { Locality } from '@/lib/types'
import 'leaflet/dist/leaflet.css'

type Props = {
  localities: Locality[]
}

// SVG pin with forget-me-not flower color
const MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
  <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
        fill="#6B8CB8" stroke="#4a6a96" stroke-width="1.5"/>
  <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
  <circle cx="14" cy="14" r="3" fill="#6B8CB8"/>
</svg>`

function buildPopupHTML(loc: Locality): string {
  const audioSection = loc.audio_url_es
    ? `<div style="padding:0 12px 4px">
         <audio controls style="width:100%;height:32px">
           <source src="${loc.audio_url_es}" type="audio/mpeg"/>
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
      <div style="background:#C9633E;padding:10px 12px">
        <strong style="color:white;font-family:Georgia,serif;font-size:15px">${loc.name}</strong>
        <div style="color:rgba(255,255,255,0.85);font-size:11px;margin-top:2px">${loc.province} · ${loc.region}</div>
      </div>
      <div style="padding:10px 12px;font-size:13px;line-height:1.5;color:#2C1810;max-height:100px;overflow-y:auto">
        ${loc.description_es}
      </div>
      ${audioSection}
      ${linkSection}
    </div>`
}

export default function Map({ localities }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)

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
        L.marker([loc.latitude, loc.longitude], { icon })
          .addTo(map!)
          .bindPopup(buildPopupHTML(loc), { maxWidth: 280 })
      })
    })

    return () => {
      cancelled = true
      if (map) {
        map.remove()
        mapInstanceRef.current = null
      }
    }
  }, [localities])

  return <div ref={mapRef} className="w-full h-full" />
}

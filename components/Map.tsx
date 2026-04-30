'use client'

import { useEffect, useRef } from 'react'
import type { Locality } from '@/lib/types'

import 'leaflet/dist/leaflet.css'

type Props = {
  localities: Locality[]
}

export default function Map({ localities }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // cancelled flag prevents double-init from React StrictMode's async effect cycle
    let cancelled = false
    let map: import('leaflet').Map | null = null

    import('leaflet').then((L) => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      map = L.map(mapRef.current!).setView([40.4, -3.7], 6)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      localities.forEach((loc) => {
        L.marker([loc.latitude, loc.longitude])
          .addTo(map!)
          .bindPopup(`<strong>${loc.name}</strong><br/>${loc.province}, ${loc.region}`)
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

  return <div ref={mapRef} className="w-full h-[600px]" />
}

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

// SVG pin en terracota, la marca reserva ese color solo para botones,
// enlaces y marcadores del mapa (sized 36x44 for accessible touch target)
const MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 28 36" aria-hidden="true">
  <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
        fill="var(--color-terracota)" stroke="var(--color-olivo)" stroke-width="1.5"/>
  <circle cx="14" cy="14" r="6" fill="var(--color-papel)" opacity="0.9"/>
  <circle cx="14" cy="14" r="3" fill="var(--color-terracota)"/>
</svg>`

const MORE_INFO_LABEL: Record<string, string> = {
  es: 'Más información',
  en: 'More information',
  fr: 'Plus d’informations',
}

// Punto especial, no ligado a una localidad real de la base de datos:
// promociona el proyecto piloto de Cabezas del Pozo (decisión 2026-10-01,
// a petición de la promotora) con un icono distinto (flor en vez de pin)
// para que no se confunda con una localidad documentada.
const PROMO_MARKER_COORDS: [number, number] = [41.0010385, -4.9551438]

// Dominio todavía sin registrar (ver turismo-cabezas-del-pozo/README.md):
// el enlace apunta ya al dominio definitivo para que funcione solo con
// registrarlo, sin tocar código, pero hoy no resuelve — de ahí el aviso
// en el propio popup.
const PROMO_WEBSITE_URL = 'https://turismocabezasdelpozo.es'

// ⚠ Pendiente: la promotora va a enviar el audio de presentación. En
// cuanto exista el archivo, colocarlo en public/audio/ y poner esto a
// true (o mejor, apuntar a Supabase Storage si se prefiere no versionar
// el mp3 en el repo).
const PROMO_HAS_AUDIO = false
const PROMO_AUDIO_URL = '/audio/cabezas-del-pozo-intro.mp3'

const PROMO_COPY: Record<string, { badge: string; title: string; body: string; audioLabel: string; linkLabel: string; domainNote: string }> = {
  es: {
    badge: 'Proyecto piloto',
    title: 'Cabezas del Pozo',
    body: 'Estamos llevando el modelo de Tú no me olvides a un municipio concreto: un mapa turístico propio para Cabezas del Pozo (Ávila).',
    audioLabel: 'Audio de presentación',
    linkLabel: 'Ver la web del proyecto →',
    domainNote: '(dominio de ejemplo, pendiente de registrar)',
  },
  en: {
    badge: 'Pilot project',
    title: 'Cabezas del Pozo',
    body: 'We’re bringing the Tú no me olvides model to a real municipality: a dedicated tourist map for Cabezas del Pozo (Ávila).',
    audioLabel: 'Introductory audio',
    linkLabel: 'View the project website →',
    domainNote: '(example domain, not registered yet)',
  },
  fr: {
    badge: 'Projet pilote',
    title: 'Cabezas del Pozo',
    body: 'Nous adaptons le modèle de Tú no me olvides à une commune réelle : une carte touristique dédiée à Cabezas del Pozo (Ávila).',
    audioLabel: 'Audio de présentation',
    linkLabel: 'Voir le site du projet →',
    domainNote: '(nom de domaine d’exemple, pas encore enregistré)',
  },
}

// Flor del no-me-olvides en insignia circular — mismo símbolo que
// FlowerIcon.tsx (no reutilizable tal cual: Leaflet necesita el SVG como
// cadena de texto, no como componente React).
const FLOWER_MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
  <circle cx="20" cy="20" r="18" fill="var(--color-papel)" stroke="var(--color-flower)" stroke-width="2.5"/>
  <g transform="translate(20 20)">
    ${[0, 72, 144, 216, 288]
      .map(
        (deg) =>
          `<ellipse cx="0" cy="0" rx="3.5" ry="7" fill="var(--color-flower)" opacity="0.9" transform="rotate(${deg}) translate(0 -4.5)"/>`,
      )
      .join('')}
    <circle cx="0" cy="0" r="3.5" fill="var(--color-papel)"/>
    <circle cx="0" cy="0" r="2.2" fill="var(--color-flower)"/>
  </g>
</svg>`

function buildPromoPopupHTML(locale: string): string {
  const c = PROMO_COPY[locale] ?? PROMO_COPY.es

  const audioSection = PROMO_HAS_AUDIO
    ? `<div style="padding:4px 14px 8px">
         <div style="font-size:11px;color:var(--color-tinta);opacity:0.7;margin-bottom:4px">${c.audioLabel}</div>
         <audio controls preload="metadata" style="width:100%">
           <source src="${PROMO_AUDIO_URL}" type="audio/mpeg"/>
         </audio>
       </div>`
    : ''

  return `
    <div>
      <div style="background:var(--color-flower);padding:12px 14px">
        <span style="display:inline-block;font-size:10px;text-transform:uppercase;letter-spacing:0.04em;color:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.6);border-radius:999px;padding:1px 8px;margin-bottom:4px">${c.badge}</span>
        <strong style="display:block;color:var(--color-sobre-terracota);font-family:var(--font-heading);font-size:16px">${c.title}</strong>
      </div>
      <div style="padding:12px 14px;font-size:14px;line-height:1.55;color:var(--color-tinta)">
        ${c.body}
      </div>
      ${audioSection}
      <div style="padding:4px 14px 14px">
        <a href="${PROMO_WEBSITE_URL}" target="_blank" rel="noopener noreferrer"
           style="font-size:12px;color:var(--color-terracota);text-decoration:underline">
          ${c.linkLabel}
        </a>
        <div style="font-size:10.5px;color:var(--color-tinta);opacity:0.6;margin-top:3px">${c.domainNote}</div>
      </div>
    </div>`
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
  const promoMarkerRef = useRef<import('leaflet').Marker | null>(null)

  // Init del mapa una sola vez (cleanup solo al desmontar el componente).
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markersRef.current = {}
        promoMarkerRef.current = null
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

        // Flor del proyecto piloto: se añade una sola vez al crear el mapa,
        // fuera de markersRef (que se limpia y repuebla en cada filtro) —
        // no es una localidad, siempre debe seguir visible.
        const promoIcon = L.divIcon({
          html: FLOWER_MARKER_SVG,
          className: '',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        })
        const promoMarker = L.marker(PROMO_MARKER_COORDS, {
          icon: promoIcon,
          alt: 'Cabezas del Pozo',
          title: 'Cabezas del Pozo',
          zIndexOffset: 1000,
        })
          .addTo(map)
          .bindPopup(buildPromoPopupHTML(locale), { maxWidth: 300 })
        const promoEl = promoMarker.getElement()
        if (promoEl) {
          promoEl.setAttribute('aria-label', 'Cabezas del Pozo — proyecto piloto')
          promoEl.setAttribute('role', 'button')
        }
        promoMarkerRef.current = promoMarker
      }

      // El popup de la flor se reconstruye en cada cambio de idioma (el
      // marker en sí no, vive fuera de markersRef para no desaparecer al
      // filtrar localidades).
      promoMarkerRef.current?.setPopupContent(buildPromoPopupHTML(locale))

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

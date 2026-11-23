import { notFound } from 'next/navigation'

// Cualquier dirección dentro de un idioma que no corresponda a ninguna página
// muestra la página «no encontrada» de la marca (app/[locale]/not-found.tsx)
// con estado 404, en lugar de la genérica de Next.js.
export default function CatchAllNotFound() {
  notFound()
}

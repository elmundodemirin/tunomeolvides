import Link from 'next/link'

// Resumen "Para ayuntamientos" debajo del mapa en la home. Solo en español
// (ver app/[locale]/ayuntamientos/page.tsx) — la página completa vive en /ayuntamientos.
export function HomeAyuntamientosTeaser() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h2
        className="text-2xl lg:text-3xl leading-tight mb-4"
        style={{ fontFamily: 'Georgia, serif', color: 'var(--color-terracotta-dark)' }}
      >
        ¿Tu municipio tiene una historia que contar?
      </h2>
      <p className="text-sm lg:text-base leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>
        No Me Olvides ofrece a los pequeños ayuntamientos un servicio completo de digitalización
        turística: investigamos tu patrimonio, lo narramos y lo ponemos en el mapa.
      </p>
      <Link
        href="/ayuntamientos"
        className="inline-block py-3 px-6 rounded-lg text-white font-medium text-sm transition-colors"
        style={{ backgroundColor: 'var(--color-terracotta)' }}
      >
        Más información
      </Link>
    </div>
  )
}

import { supabase } from '@/lib/supabase'
import type { Locality } from '@/lib/types'
import MapWrapper from '@/components/MapWrapper'

export default async function Home() {
  const { data: localities, error } = await supabase
    .from('localities')
    .select('*')
    .eq('active', true)
    .order('name')

  if (error) {
    return <p className="p-8" style={{ color: 'var(--color-terracotta)' }}>Error cargando localidades: {error.message}</p>
  }

  return (
    <main className="flex flex-col h-screen">
      <header style={{ backgroundColor: 'var(--color-terracotta)' }} className="px-6 py-4 flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* 5 petals */}
          {[0,72,144,216,288].map((deg) => (
            <ellipse key={deg} cx="14" cy="14" rx="4" ry="8"
              fill="#6B8CB8" opacity="0.9"
              transform={`rotate(${deg} 14 14) translate(0 -5)`}
            />
          ))}
          {/* center */}
          <circle cx="14" cy="14" r="4" fill="#FAF6EE"/>
          <circle cx="14" cy="14" r="2.5" fill="#6B8CB8"/>
        </svg>
        <div>
          <h1 className="text-white text-xl leading-tight">No Me Olvides</h1>
          <p className="text-white/80 text-xs">Patrimonio cultural de la España vaciada</p>
        </div>
      </header>
      <div className="flex-1">
        <MapWrapper localities={(localities as Locality[]) ?? []} />
      </div>
    </main>
  )
}

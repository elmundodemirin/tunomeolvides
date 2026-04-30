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
    return <p className="p-8 text-red-600">Error cargando localidades: {error.message}</p>
  }

  return (
    <main className="flex flex-col h-screen">
      <header className="p-4 bg-white border-b">
        <h1 className="text-xl font-bold">No Me Olvides</h1>
      </header>
      <div className="flex-1">
        <MapWrapper localities={(localities as Locality[]) ?? []} />
      </div>
    </main>
  )
}

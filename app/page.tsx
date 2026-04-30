import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data: localities, error } = await supabase
    .from('localities')
    .select('id, name, province, region')
    .eq('active', true)
    .order('name')

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">No Me Olvides — test de conexión</h1>

      {error && (
        <p className="text-red-600">Error: {error.message}</p>
      )}

      {localities && localities.length > 0 ? (
        <ul className="space-y-2">
          {localities.map((loc) => (
            <li key={loc.id} className="border p-3 rounded">
              <strong>{loc.name}</strong> — {loc.province}, {loc.region}
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No se encontraron localidades.</p>
      )}
    </main>
  )
}

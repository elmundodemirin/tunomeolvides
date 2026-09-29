import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { LocalitiesManager } from '@/components/admin/LocalitiesManager'
import type { Locality } from '@/lib/types'

type Row = Pick<Locality, 'id' | 'name' | 'province' | 'region' | 'active'>

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const { data: localities, error } = await supabase
    .from('localities')
    .select('id, name, province, region, active, created_at')
    .order('created_at', { ascending: false })

  const all = (localities as Row[] | null) ?? []
  const total = all.length
  const active = all.filter(l => l.active).length
  const inactive = total - active

  return (
    // pb-32 evita que la barra flotante de acciones tape la última fila
    <div className="p-8 pb-32">

      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-bold text-terracota"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Localidades
        </h1>
        <Link
          href="/admin/localities/new"
          className="bg-terracota hover:opacity-90 text-sobre-terracota text-sm font-medium px-4 py-2 rounded-marca transition-colors"
        >
          + Nueva localidad
        </Link>
      </div>

      {/* Tarjetas de resumen (siempre totales, no se ven afectadas por el filtro) */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total" value={total} />
        <StatCard label="Activas" value={active} color="text-olivo" />
        <StatCard label="Inactivas" value={inactive} color="text-tinta/60" />
      </div>

      {/* Filtro + tabla + acciones masivas */}
      {error ? (
        <p className="text-red-600 text-sm">Error al cargar las localidades.</p>
      ) : all.length === 0 ? (
        <p className="text-tinta/60 text-sm">Aún no hay localidades. ¡Crea la primera!</p>
      ) : (
        <LocalitiesManager localities={all} />
      )}
    </div>
  )
}

function StatCard({ label, value, color = 'text-tinta' }: {
  label: string
  value: number
  color?: string
}) {
  return (
    <div className="bg-white rounded-marca border border-papel-hondo px-6 py-5">
      <p className="text-xs text-dorado-lema uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

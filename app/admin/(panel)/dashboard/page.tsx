import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Locality } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  const { data: localities, error } = await supabase
    .from('localities')
    .select('id, name, province, region, active, created_at')
    .order('created_at', { ascending: false })

  const all = (localities as Pick<Locality, 'id' | 'name' | 'province' | 'region' | 'active'>[] | null) ?? []
  const total = all.length
  const active = all.filter(l => l.active).length
  const inactive = total - active

  return (
    <div className="p-8">

      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-bold text-[#8E4226]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Localidades
        </h1>
        <Link
          href="/admin/localities/new"
          className="bg-[#C9633E] hover:bg-[#8E4226] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva localidad
        </Link>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total" value={total} />
        <StatCard label="Activas" value={active} color="text-[#5F7355]" />
        <StatCard label="Inactivas" value={inactive} color="text-[#a07860]" />
      </div>

      {/* Tabla de localidades */}
      {error ? (
        <p className="text-red-600 text-sm">Error al cargar las localidades.</p>
      ) : all.length === 0 ? (
        <p className="text-[#a07860] text-sm">Aún no hay localidades. ¡Crea la primera!</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EFE8D6] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF6EE] border-b border-[#EFE8D6]">
              <tr>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold">Localidad</th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold">Provincia</th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold">Comunidad</th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8D6]">
              {all.map(locality => (
                <tr key={locality.id} className="hover:bg-[#FAF6EE] transition-colors">
                  <td className="px-5 py-3 font-medium text-[#3d2b1f]">{locality.name}</td>
                  <td className="px-5 py-3 text-[#5a3f30]">{locality.province}</td>
                  <td className="px-5 py-3 text-[#5a3f30]">{locality.region}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      locality.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {locality.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/localities/${locality.id}/edit`}
                      className="text-[#C9633E] hover:text-[#8E4226] font-medium transition-colors"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color = 'text-[#3d2b1f]' }: {
  label: string
  value: number
  color?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#EFE8D6] px-6 py-5">
      <p className="text-xs text-[#a07860] uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

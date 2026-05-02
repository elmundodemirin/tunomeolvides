import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { ContactMessage } from '@/lib/types'

export default async function MensajesPage() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, name, email, message, created_at, handled')
    .order('handled', { ascending: true })
    .order('created_at', { ascending: false })

  const all = (data ?? []) as Pick<ContactMessage, 'id' | 'name' | 'email' | 'message' | 'created_at' | 'handled'>[]
  const total = all.length
  const pending = all.filter(m => !m.handled).length
  const attended = total - pending

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-bold text-[#8E4226]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Mensajes de contacto
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total" value={total} />
        <StatCard label="Pendientes" value={pending} color="text-[#C9633E]" />
        <StatCard label="Atendidos" value={attended} color="text-[#5F7355]" />
      </div>

      {error ? (
        <p className="text-red-600 text-sm">Error al cargar los mensajes.</p>
      ) : all.length === 0 ? (
        <p className="text-[#a07860] text-sm">Aún no hay mensajes de contacto.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EFE8D6] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF6EE] border-b border-[#EFE8D6]">
              <tr>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold">Nombre</th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold hidden md:table-cell">Mensaje</th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold hidden sm:table-cell">Fecha</th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8D6]">
              {all.map(msg => (
                <tr key={msg.id} className="hover:bg-[#FAF6EE] transition-colors">
                  <td className="px-5 py-3 font-medium text-[#2C1810]">{msg.name}</td>
                  <td className="px-5 py-3 text-[#5a3f30] hidden sm:table-cell">{msg.email}</td>
                  <td className="px-5 py-3 text-[#5a3f30] hidden md:table-cell max-w-xs">
                    <span className="block truncate">
                      {msg.message.length > 80 ? msg.message.slice(0, 80) + '…' : msg.message}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#a07860] hidden sm:table-cell whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      msg.handled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {msg.handled ? 'Atendido' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/mensajes/${msg.id}`}
                      className="text-[#C9633E] hover:text-[#8E4226] font-medium transition-colors"
                    >
                      Ver
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

function StatCard({ label, value, color = 'text-[#2C1810]' }: {
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

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
          className="text-2xl font-bold text-terracota"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Mensajes de contacto
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total" value={total} />
        <StatCard label="Pendientes" value={pending} color="text-terracota" />
        <StatCard label="Atendidos" value={attended} color="text-olivo" />
      </div>

      {error ? (
        <p className="text-red-600 text-sm">Error al cargar los mensajes.</p>
      ) : all.length === 0 ? (
        <p className="text-tinta/60 text-sm">Aún no hay mensajes de contacto.</p>
      ) : (
        <div className="bg-white rounded-marca border border-papel-hondo overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-papel border-b border-papel-hondo">
              <tr>
                <th className="text-left px-5 py-3 text-terracota font-semibold">Nombre</th>
                <th className="text-left px-5 py-3 text-terracota font-semibold hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3 text-terracota font-semibold hidden md:table-cell">Mensaje</th>
                <th className="text-left px-5 py-3 text-terracota font-semibold hidden sm:table-cell">Fecha</th>
                <th className="text-left px-5 py-3 text-terracota font-semibold">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-papel-hondo">
              {all.map(msg => (
                <tr key={msg.id} className="hover:bg-papel transition-colors">
                  <td className="px-5 py-3 font-medium text-tinta">{msg.name}</td>
                  <td className="px-5 py-3 text-tinta/85 hidden sm:table-cell">{msg.email}</td>
                  <td className="px-5 py-3 text-tinta/85 hidden md:table-cell max-w-xs">
                    <span className="block truncate">
                      {msg.message.length > 80 ? msg.message.slice(0, 80) + '…' : msg.message}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-tinta/60 hidden sm:table-cell whitespace-nowrap">
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
                      className="text-terracota hover:opacity-80 font-medium transition-colors"
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

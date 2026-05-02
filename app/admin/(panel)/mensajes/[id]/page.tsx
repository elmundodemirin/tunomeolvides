import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { MessageActions } from '@/components/admin/MessageActions'
import type { ContactMessage } from '@/lib/types'

export default async function MensajeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) notFound()

  const msg = data as ContactMessage

  let handledByEmail: string | null = null
  if (msg.handled_by) {
    const adminClient = createSupabaseAdminClient()
    const { data: { user } } = await adminClient.auth.admin.getUserById(msg.handled_by)
    handledByEmail = user?.email ?? null
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })

  return (
    <div className="p-8 max-w-2xl">

      <div className="mb-6">
        <Link
          href="/admin/mensajes"
          className="text-sm text-[#C9633E] hover:text-[#8E4226] transition-colors"
        >
          ← Volver a mensajes
        </Link>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-[#8E4226]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {msg.name}
          </h1>
          <p className="text-sm text-[#a07860] mt-0.5">{msg.email}</p>
        </div>
        <span className={`shrink-0 mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          msg.handled ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {msg.handled ? 'Atendido' : 'Pendiente'}
        </span>
      </div>

      <div className="space-y-6">

        {/* Metadatos */}
        <div className="bg-[#FAF6EE] rounded-xl border border-[#EFE8D6] px-5 py-4 text-sm space-y-1.5">
          <p>
            <span className="text-[#a07860]">Recibido el:</span>{' '}
            <span className="text-[#3d2b1f]">{fmt(msg.created_at)}</span>
          </p>
          {msg.handled && msg.handled_at && (
            <p>
              <span className="text-[#a07860]">Atendido el:</span>{' '}
              <span className="text-[#3d2b1f]">{fmt(msg.handled_at)}</span>
              {handledByEmail && (
                <span className="text-[#a07860]"> · {handledByEmail}</span>
              )}
            </p>
          )}
        </div>

        {/* Texto del mensaje */}
        <div>
          <h2 className="text-xs font-semibold text-[#a07860] uppercase tracking-wide mb-2">
            Mensaje
          </h2>
          <blockquote className="bg-white border border-[#EFE8D6] rounded-xl px-5 py-4 text-sm text-[#3d2b1f] whitespace-pre-wrap leading-relaxed">
            {msg.message}
          </blockquote>
        </div>

        {/* Acciones: marcar atendido, notas, eliminar */}
        <MessageActions
          messageId={msg.id}
          handled={msg.handled}
          adminNotes={msg.admin_notes}
        />

      </div>
    </div>
  )
}

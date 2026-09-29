'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

type Props = {
  messageId: string
  handled: boolean
  adminNotes: string | null
}

export function MessageActions({ messageId, handled, adminNotes }: Props) {
  const router = useRouter()
  const [notes, setNotes] = useState(adminNotes ?? '')
  const [marking, setMarking] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleMark() {
    setMarking(true)
    setError(null)
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { error: e } = await supabase
      .from('contact_messages')
      .update({
        handled: true,
        handled_at: new Date().toISOString(),
        handled_by: user?.id ?? null,
      })
      .eq('id', messageId)
    if (e) setError('Error al marcar el mensaje. Inténtalo de nuevo.')
    else router.refresh()
    setMarking(false)
  }

  async function handleSaveNotes() {
    setSavingNotes(true)
    setError(null)
    const supabase = createSupabaseBrowserClient()
    const { error: e } = await supabase
      .from('contact_messages')
      .update({ admin_notes: notes.trim() || null })
      .eq('id', messageId)
    if (e) setError('Error al guardar la nota. Inténtalo de nuevo.')
    else router.refresh()
    setSavingNotes(false)
  }

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    const supabase = createSupabaseBrowserClient()
    const { error: e } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', messageId)
    if (e) {
      setError('Error al eliminar el mensaje. Inténtalo de nuevo.')
      setDeleting(false)
    } else {
      router.push('/admin/mensajes')
    }
  }

  return (
    <div className="space-y-6">

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Marcar como atendido */}
      {!handled && (
        <div>
          <button
            type="button"
            onClick={handleMark}
            disabled={marking}
            className="bg-olivo hover:opacity-90 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-marca transition-colors"
          >
            {marking ? 'Guardando…' : 'Marcar como atendido'}
          </button>
        </div>
      )}

      {/* Notas del administrador */}
      <div>
        <label className="block text-xs font-semibold text-dorado-lema uppercase tracking-wide mb-2">
          Notas internas
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
          placeholder="Añade notas internas sobre este mensaje (no son visibles para el remitente)…"
          className="w-full border border-papel-hondo rounded-marca px-3 py-2 text-sm text-tinta placeholder-tinta/40 focus:outline-none focus:ring-2 focus:ring-terracota resize-none"
        />
        <button
          type="button"
          onClick={handleSaveNotes}
          disabled={savingNotes}
          className="mt-2 text-sm text-terracota hover:opacity-80 font-medium disabled:opacity-50 transition-colors"
        >
          {savingNotes ? 'Guardando…' : 'Guardar nota'}
        </button>
      </div>

      {/* Zona peligrosa */}
      <div className="border-t border-papel-hondo pt-6">
        {confirmDelete ? (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-tinta/85">¿Seguro que quieres eliminar este mensaje?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-marca transition-colors disabled:opacity-50"
            >
              {deleting ? 'Eliminando…' : 'Sí, eliminar'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-sm text-tinta/60 hover:text-tinta/85 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Eliminar mensaje
          </button>
        )}
      </div>

    </div>
  )
}

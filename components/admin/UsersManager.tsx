'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type AdminUser = {
  id: string
  email?: string
  created_at: string
  last_sign_in_at?: string
}

type Props = {
  users: AdminUser[]
  currentUserId: string
}

export function UsersManager({ users: initialUsers, currentUserId }: Props) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteLoading(true)
    setInviteError(null)
    setInviteSuccess(false)

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail }),
    })

    if (!res.ok) {
      const err = await res.json()
      setInviteError(err.error ?? 'Error al enviar la invitación.')
    } else {
      setInviteSuccess(true)
      setInviteEmail('')
      router.refresh()
      // Actualizar lista localmente
      const newUser = await res.json().catch(() => null)
      if (newUser) setUsers(prev => [...prev, newUser])
    }
    setInviteLoading(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setConfirmDeleteId(null)

    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })

    if (!res.ok) {
      const err = await res.json()
      alert(err.error ?? 'Error al eliminar el usuario.')
    } else {
      setUsers(prev => prev.filter(u => u.id !== id))
    }
    setDeletingId(null)
  }

  return (
    <div className="space-y-8 max-w-2xl">

      {/* Invitar usuario */}
      <div className="bg-white rounded-2xl border border-[#EFE8D6] p-6">
        <h2
          className="text-base font-semibold text-[#8E4226] mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Invitar nuevo administrador
        </h2>

        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="correo@ejemplo.com"
            value={inviteEmail}
            onChange={e => { setInviteEmail(e.target.value); setInviteSuccess(false); setInviteError(null) }}
            className="flex-1 border border-[#EFE8D6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9633E] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={inviteLoading}
            className="bg-[#C9633E] hover:bg-[#8E4226] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {inviteLoading ? 'Enviando…' : 'Enviar invitación'}
          </button>
        </form>

        {inviteError && (
          <p className="text-sm text-red-600 mt-2">{inviteError}</p>
        )}
        {inviteSuccess && (
          <p className="text-sm text-[#5F7355] mt-2">
            Invitación enviada. El usuario recibirá un email para activar su cuenta.
          </p>
        )}
        <p className="text-xs text-[#a07860] mt-3">
          El usuario invitado recibirá un email con un enlace para establecer su contraseña
          y acceder al panel.
        </p>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white rounded-2xl border border-[#EFE8D6] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EFE8D6]">
          <h2
            className="text-base font-semibold text-[#8E4226]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Administradores activos ({users.length})
          </h2>
        </div>

        {users.length === 0 ? (
          <p className="px-6 py-4 text-sm text-[#a07860]">No hay usuarios registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#FAF6EE] border-b border-[#EFE8D6]">
              <tr>
                <th className="text-left px-6 py-3 text-[#8E4226] font-semibold">Email</th>
                <th className="text-left px-6 py-3 text-[#8E4226] font-semibold">Último acceso</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8D6]">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-[#FAF6EE] transition-colors">
                  <td className="px-6 py-3 text-[#2C1810]">
                    {u.email}
                    {u.id === currentUserId && (
                      <span className="ml-2 text-xs text-[#5F7355] font-medium">(tú)</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-[#a07860]">
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleDateString('es-ES', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })
                      : 'Nunca'}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {u.id === currentUserId ? (
                      <span className="text-xs text-[#a07860]">—</span>
                    ) : confirmDeleteId === u.id ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-xs text-[#5a3f30]">¿Seguro?</span>
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={deletingId === u.id}
                          className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-60"
                        >
                          {deletingId === u.id ? 'Eliminando…' : 'Sí, eliminar'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-[#a07860] hover:text-[#5a3f30]"
                        >
                          Cancelar
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(u.id)}
                        className="text-xs text-[#a07860] hover:text-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}

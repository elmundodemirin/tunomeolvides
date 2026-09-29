'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

type Props = {
  userEmail: string
}

// Formulario para que un admin ya autenticado cambie su contraseña.
// Pide la contraseña actual primero (por si alguien encuentra la sesión
// abierta en otro dispositivo). Luego usa auth.updateUser para guardar
// la nueva. La sesión sigue activa tras el cambio.
export function PasswordChangeForm({ userEmail }: Props) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword.length < 8) {
      setError('La contraseña nueva debe tener al menos 8 caracteres.')
      return
    }
    if (newPassword !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (newPassword === currentPassword) {
      setError('La contraseña nueva debe ser distinta de la actual.')
      return
    }

    setLoading(true)
    const supabase = createSupabaseBrowserClient()

    // Verificamos la contraseña actual con un signIn (no rompe la sesión,
    // sólo crea un access token nuevo encima del existente).
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: currentPassword,
    })

    if (signInError) {
      setError('La contraseña actual no es correcta.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setError(updateError.message ?? 'Error al guardar la contraseña.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirm('')
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-marca border border-papel-hondo p-6 space-y-5"
    >
      <div>
        <h2
          className="text-base font-semibold text-terracota"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Cambiar contraseña
        </h2>
        <p className="text-sm text-tinta/60 mt-0.5">
          Por seguridad, confirma primero tu contraseña actual.
        </p>
      </div>

      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-tinta mb-1"
        >
          Contraseña actual
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className="w-full border border-papel-hondo rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-tinta mb-1"
        >
          Contraseña nueva
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="w-full border border-papel-hondo rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent"
        />
        <p className="text-xs text-tinta/60 mt-1">Mínimo 8 caracteres.</p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-tinta mb-1"
        >
          Repetir contraseña nueva
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full border border-papel-hondo rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-marca px-3 py-2">{error}</p>
      )}
      {success && (
        <p className="text-sm text-olivo bg-papel rounded-marca px-3 py-2">
          Contraseña actualizada correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-terracota hover:opacity-90 text-sobre-terracota text-sm font-medium px-5 py-2 rounded-marca transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Guardando…' : 'Guardar nueva contraseña'}
      </button>
    </form>
  )
}

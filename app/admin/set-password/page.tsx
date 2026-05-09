'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { FlowerIcon } from '@/components/FlowerIcon'

// Página a la que aterriza el usuario invitado tras pinchar el enlace del email.
// Supabase deja la sesión activa (los tokens viajan en el hash de la URL y los
// detecta @supabase/ssr automáticamente). Aquí solo le pedimos que fije una
// contraseña con auth.updateUser. Sirve también para "recuperar contraseña".
export default function SetPasswordPage() {
  const router = useRouter()
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const supabase = createSupabaseBrowserClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message ?? 'Error al guardar la contraseña.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/admin/dashboard')
      router.refresh()
    }, 1500)
  }

  // Estado: comprobando sesión
  if (hasSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-[#a07860]">Cargando…</p>
      </div>
    )
  }

  // Estado: enlace inválido o caducado
  if (hasSession === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-3">
            <FlowerIcon size={44} />
          </div>
          <h1
            className="text-2xl font-bold text-[#8E4226] mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Enlace no válido
          </h1>
          <p className="text-sm text-[#5a3f30] mb-6">
            Este enlace ha caducado o ya ha sido usado. Pídele al administrador
            una invitación nueva.
          </p>
          <a
            href="/admin/login"
            className="text-sm text-[#C9633E] hover:text-[#8E4226] transition-colors"
          >
            Ir al inicio de sesión
          </a>
        </div>
      </div>
    )
  }

  // Estado: sesión activa, mostrar formulario
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <FlowerIcon size={44} />
          </div>
          <h1
            className="text-2xl font-bold text-[#8E4226]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Establece tu contraseña
          </h1>
          <p className="text-sm text-[#5F7355] mt-1">
            Bienvenida al panel de No Me Olvides
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-[#EFE8D6] p-8 space-y-5"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#2C1810] mb-1"
            >
              Contraseña nueva
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-[#EFE8D6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9633E] focus:border-transparent"
            />
            <p className="text-xs text-[#a07860] mt-1">Mínimo 8 caracteres.</p>
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-[#2C1810] mb-1"
            >
              Repetir contraseña
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full border border-[#EFE8D6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9633E] focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-[#5F7355] bg-[#FAF6EE] rounded-lg px-3 py-2">
              Contraseña guardada. Redirigiendo al panel…
            </p>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#C9633E] hover:bg-[#8E4226] text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando…' : success ? 'Listo' : 'Guardar contraseña'}
          </button>
        </form>

      </div>
    </div>
  )
}

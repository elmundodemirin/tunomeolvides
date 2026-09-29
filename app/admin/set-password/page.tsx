'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { FlowerIcon } from '@/components/FlowerIcon'

// Página a la que aterriza el usuario invitado tras pinchar el enlace del email.
// Supabase deja la sesión activa (los tokens viajan en el hash de la URL y los
// detecta @supabase/ssr automáticamente). Aquí solo le pedimos que fije una
// contraseña con auth.updateUser. Sirve también para "recuperar contraseña".
export default function SetPasswordPage() {
  const [hasSession, setHasSession] = useState<boolean | null>(null)
  const [linkError, setLinkError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    // 1) Mira si Supabase ha devuelto algún error en la URL.
    //    Estos errores pueden venir en el hash (flujo implícito) o en
    //    la query (flujo PKCE). Si hay error, lo mostramos tal cual
    //    para no enmascararlo bajo un "enlace caducado" genérico.
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const queryParams = new URLSearchParams(window.location.search)
    const urlError =
      hashParams.get('error_description') ??
      queryParams.get('error_description') ??
      hashParams.get('error') ??
      queryParams.get('error') ??
      null

    if (urlError) {
      console.error('[set-password] Supabase auth error in URL:', urlError)
      setLinkError(urlError.replace(/\+/g, ' '))
      setHasSession(false)
      return
    }

    // 2) Flujo PKCE: la URL trae ?code=... y hay que canjearlo por sesión.
    const code = queryParams.get('code')
    if (code) {
      console.info('[set-password] PKCE code detected in URL, exchanging…')
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error) {
          console.error('[set-password] exchangeCodeForSession failed:', error)
          setLinkError(error.message)
          setHasSession(false)
          return
        }
        if (data?.session) {
          setHasSession(true)
          // Limpia la URL para que recargas posteriores no reintenten el canje.
          window.history.replaceState({}, '', window.location.pathname)
        }
      })
    }

    // 3) Flujo implícito (#access_token=...) o sesión ya en cookies.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setHasSession(true)
    })

    // 4) Por si la sesión llega de forma asíncrona tras detectar el hash.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setHasSession(true)
    })

    // 5) Margen antes de decidir "enlace no válido". Si todo está roto,
    //    aquí caemos: nada de session, ni hash, ni code válido.
    const fallback = setTimeout(() => {
      setHasSession(prev => (prev === null ? false : prev))
    }, 1500)

    return () => {
      clearTimeout(fallback)
      subscription.unsubscribe()
    }
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
    // Full reload (no router.push) para garantizar que la cookie de sesión
    // viaja en la siguiente petición y el middleware no rebota a /login.
    setTimeout(() => {
      window.location.assign('/admin/dashboard')
    }, 1500)
  }

  // Estado: comprobando sesión
  if (hasSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-tinta/60">Cargando…</p>
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
            className="text-2xl font-bold text-terracota mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Enlace no válido
          </h1>
          <p className="text-sm text-tinta/85 mb-6">
            Este enlace ha caducado o ya ha sido usado. Pídele al administrador
            una invitación nueva.
          </p>
          {linkError && (
            <p className="text-xs text-tinta/60 bg-papel rounded-marca px-3 py-2 mb-6 break-words">
              Detalle: {linkError}
            </p>
          )}
          <a
            href="/admin/login"
            className="text-sm text-terracota hover:opacity-80 transition-colors"
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
            className="text-2xl font-bold text-terracota"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Establece tu contraseña
          </h1>
          <p className="text-sm text-olivo mt-1">
            Bienvenida al panel de <span className="marca">Tú no me olvides</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-marca shadow-sm border border-papel-hondo p-8 space-y-5"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-tinta mb-1"
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
              className="w-full border border-papel-hondo rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent"
            />
            <p className="text-xs text-tinta/60 mt-1">Mínimo 8 caracteres.</p>
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-sm font-medium text-tinta mb-1"
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
              className="w-full border border-papel-hondo rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-marca px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-olivo bg-papel rounded-marca px-3 py-2">
              Contraseña guardada. Redirigiendo al panel…
            </p>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-terracota hover:opacity-90 text-sobre-terracota font-medium py-2 rounded-marca transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando…' : success ? 'Listo' : 'Guardar contraseña'}
          </button>
        </form>

      </div>
    </div>
  )
}

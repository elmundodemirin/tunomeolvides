'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { FlowerIcon } from '@/components/FlowerIcon'

type Mode = 'signin' | 'recover'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  async function handleRecover(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setRecoverySent(false)

    const supabase = createSupabaseBrowserClient()
    // redirectTo explícito a /admin/set-password — así no depende de la
    // Site URL del dashboard de Supabase.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/admin/set-password`,
    })

    if (error) {
      setError(error.message ?? 'No se pudo enviar el email de recuperación.')
      setLoading(false)
      return
    }

    setRecoverySent(true)
    setLoading(false)
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setRecoverySent(false)
    setPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <FlowerIcon size={44} />
          </div>
          <h1
            className="text-2xl font-bold text-terracota"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span className="marca">Tú no me olvides</span>
          </h1>
          <p className="text-sm text-olivo mt-1">Panel de administración</p>
        </div>

        {mode === 'signin' ? (
          <>
            <form
              onSubmit={handleSignIn}
              className="bg-white rounded-marca shadow-sm border border-papel-hondo p-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-tinta mb-1"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-papel-hondo rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-tinta mb-1"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-papel-hondo rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-marca px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-terracota hover:opacity-90 text-sobre-terracota font-medium py-2 rounded-marca transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
            </form>

            <p className="text-center mt-4">
              <button
                type="button"
                onClick={() => switchMode('recover')}
                className="text-sm text-terracota hover:opacity-80 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </p>
          </>
        ) : (
          <>
            <form
              onSubmit={handleRecover}
              className="bg-white rounded-marca shadow-sm border border-papel-hondo p-8 space-y-5"
            >
              <div>
                <p className="text-sm text-tinta/85 mb-4">
                  Escribe tu correo y te enviaremos un enlace para fijar una
                  contraseña nueva.
                </p>
                <label
                  htmlFor="recover-email"
                  className="block text-sm font-medium text-tinta mb-1"
                >
                  Correo electrónico
                </label>
                <input
                  id="recover-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-papel-hondo rounded-marca px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracota focus:border-transparent"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-marca px-3 py-2">
                  {error}
                </p>
              )}
              {recoverySent && (
                <p className="text-sm text-olivo bg-papel rounded-marca px-3 py-2">
                  Te hemos enviado un email con el enlace. Revisa tu bandeja de
                  entrada (y la carpeta de spam, por si acaso).
                </p>
              )}

              <button
                type="submit"
                disabled={loading || recoverySent}
                className="w-full bg-terracota hover:opacity-90 text-sobre-terracota font-medium py-2 rounded-marca transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando…' : recoverySent ? 'Enviado' : 'Enviar enlace de recuperación'}
              </button>
            </form>

            <p className="text-center mt-4">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-sm text-terracota hover:opacity-80 transition-colors"
              >
                ← Volver al inicio de sesión
              </button>
            </p>
          </>
        )}

      </div>
    </div>
  )
}

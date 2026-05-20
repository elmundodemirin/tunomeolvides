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
            className="text-2xl font-bold text-[#8E4226]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            No Me Olvides
          </h1>
          <p className="text-sm text-[#5F7355] mt-1">Panel de administración</p>
        </div>

        {mode === 'signin' ? (
          <>
            <form
              onSubmit={handleSignIn}
              className="bg-white rounded-2xl shadow-sm border border-[#EFE8D6] p-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#2C1810] mb-1"
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
                  className="w-full border border-[#EFE8D6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9633E] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#2C1810] mb-1"
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
                  className="w-full border border-[#EFE8D6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9633E] focus:border-transparent"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C9633E] hover:bg-[#8E4226] text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
            </form>

            <p className="text-center mt-4">
              <button
                type="button"
                onClick={() => switchMode('recover')}
                className="text-sm text-[#C9633E] hover:text-[#8E4226] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </p>
          </>
        ) : (
          <>
            <form
              onSubmit={handleRecover}
              className="bg-white rounded-2xl shadow-sm border border-[#EFE8D6] p-8 space-y-5"
            >
              <div>
                <p className="text-sm text-[#5a3f30] mb-4">
                  Escribe tu correo y te enviaremos un enlace para fijar una
                  contraseña nueva.
                </p>
                <label
                  htmlFor="recover-email"
                  className="block text-sm font-medium text-[#2C1810] mb-1"
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
                  className="w-full border border-[#EFE8D6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9633E] focus:border-transparent"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              {recoverySent && (
                <p className="text-sm text-[#5F7355] bg-[#FAF6EE] rounded-lg px-3 py-2">
                  Te hemos enviado un email con el enlace. Revisa tu bandeja de
                  entrada (y la carpeta de spam, por si acaso).
                </p>
              )}

              <button
                type="submit"
                disabled={loading || recoverySent}
                className="w-full bg-[#C9633E] hover:bg-[#8E4226] text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando…' : recoverySent ? 'Enviado' : 'Enviar enlace de recuperación'}
              </button>
            </form>

            <p className="text-center mt-4">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className="text-sm text-[#C9633E] hover:text-[#8E4226] transition-colors"
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

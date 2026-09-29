import { createSupabaseServerClient } from '@/lib/supabase-server'
import { PasswordChangeForm } from '@/components/admin/PasswordChangeForm'

export default async function CuentaPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  // El layout del panel ya redirige a /admin/login si no hay sesión,
  // así que aquí user siempre existe.
  const userEmail = user?.email ?? ''

  return (
    <div className="p-8 max-w-xl">

      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-terracota"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Mi cuenta
        </h1>
        <p className="text-sm text-tinta/60 mt-1">
          Datos de tu acceso al panel de administración.
        </p>
      </div>

      {/* Datos básicos del usuario */}
      <div className="bg-white rounded-marca border border-papel-hondo p-6 mb-6">
        <h2 className="text-xs font-semibold text-dorado-lema uppercase tracking-wide mb-3">
          Tus datos
        </h2>
        <dl className="text-sm">
          <dt className="text-tinta/60 mb-1">Correo electrónico</dt>
          <dd className="text-tinta">{userEmail}</dd>
        </dl>
      </div>

      {/* Cambiar contraseña */}
      <PasswordChangeForm userEmail={userEmail} />

    </div>
  )
}

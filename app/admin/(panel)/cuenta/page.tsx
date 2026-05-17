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
          className="text-2xl font-bold text-[#8E4226]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Mi cuenta
        </h1>
        <p className="text-sm text-[#a07860] mt-1">
          Datos de tu acceso al panel de administración.
        </p>
      </div>

      {/* Datos básicos del usuario */}
      <div className="bg-white rounded-2xl border border-[#EFE8D6] p-6 mb-6">
        <h2 className="text-xs font-semibold text-[#a07860] uppercase tracking-wide mb-3">
          Tus datos
        </h2>
        <dl className="text-sm">
          <dt className="text-[#a07860] mb-1">Correo electrónico</dt>
          <dd className="text-[#2C1810]">{userEmail}</dd>
        </dl>
      </div>

      {/* Cambiar contraseña */}
      <PasswordChangeForm userEmail={userEmail} />

    </div>
  )
}

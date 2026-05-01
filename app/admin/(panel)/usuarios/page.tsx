import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { UsersManager } from '@/components/admin/UsersManager'

export default async function UsuariosPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const admin = createSupabaseAdminClient()
  const { data, error } = await admin.auth.admin.listUsers()
  const users = error ? [] : data.users.map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
  }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-[#8E4226]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Administradores
        </h1>
        <p className="text-sm text-[#a07860] mt-1">
          Gestiona quién tiene acceso al panel. Los usuarios invitados reciben
          un email para activar su cuenta.
        </p>
      </div>

      <UsersManager users={users} currentUserId={user.id} />
    </div>
  )
}

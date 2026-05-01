import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

// GET /api/admin/users — listar todos los usuarios admin
export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createSupabaseAdminClient()
  const { data, error } = await admin.auth.admin.listUsers()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data.users)
}

// POST /api/admin/users — invitar usuario por email
export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

  const admin = createSupabaseAdminClient()
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data.user, { status: 201 })
}

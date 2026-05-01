import { createClient } from '@supabase/supabase-js'

// Cliente con service_role: bypasea RLS y permite gestionar usuarios.
// SOLO usar en Route Handlers del servidor. NUNCA exponer al cliente.
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

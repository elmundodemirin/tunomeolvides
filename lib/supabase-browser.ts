import { createBrowserClient } from '@supabase/ssr'

// Cliente para componentes de cliente (browser).
// Gestiona la sesión mediante cookies automáticamente.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

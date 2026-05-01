'use client'

import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full text-left px-4 py-2 text-sm text-[#EFE8D6] hover:bg-[#8E4226] rounded-lg transition-colors"
    >
      Cerrar sesión
    </button>
  )
}

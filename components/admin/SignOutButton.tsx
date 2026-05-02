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
      className="w-full text-left px-4 py-2 text-sm text-[#FAF6EE] hover:bg-[#C9633E] rounded-lg transition-colors"
    >
      Cerrar sesión
    </button>
  )
}

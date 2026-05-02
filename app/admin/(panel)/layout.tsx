import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { SignOutButton } from '@/components/admin/SignOutButton'
import { AdminMobileMenu } from '@/components/admin/AdminMobileMenu'

const navLinks = [
  { href: '/admin/dashboard', label: 'Inicio' },
  { href: '/admin/localities', label: 'Localidades' },
  { href: '/admin/usuarios', label: 'Usuarios' },
]

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const userEmail = user.email ?? ''

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* Top bar (solo móvil) */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#3d2b1f] sticky top-0 z-30">
        <Link href="/admin/dashboard" className="flex items-center gap-2 no-underline">
          <span className="text-lg" aria-hidden="true">✿</span>
          <span
            className="text-[#FAF6EE] text-sm font-bold"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            No Me Olvides
          </span>
          <span className="text-[#a07860] text-xs">· Admin</span>
        </Link>
        <AdminMobileMenu items={navLinks} userEmail={userEmail} />
      </header>

      {/* Barra lateral (solo escritorio) */}
      <aside className="hidden lg:flex w-56 bg-[#3d2b1f] flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-[#5a3f30]">
          <div className="text-xl mb-1">✿</div>
          <span
            className="text-[#FAF6EE] text-sm font-bold"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            No Me Olvides
          </span>
          <p className="text-[#a07860] text-xs mt-0.5">Panel de administración</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-sm text-[#EFE8D6] hover:bg-[#5a3f30] rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Usuario + cerrar sesión */}
        <div className="px-3 py-4 border-t border-[#5a3f30]">
          <p className="px-4 text-xs text-[#a07860] truncate mb-2">{userEmail}</p>
          <SignOutButton />
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

    </div>
  )
}

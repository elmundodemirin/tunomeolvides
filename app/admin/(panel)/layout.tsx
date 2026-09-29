import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { SignOutButton } from '@/components/admin/SignOutButton'
import { AdminMobileMenu } from '@/components/admin/AdminMobileMenu'
import { FlowerIcon } from '@/components/FlowerIcon'

const navLinks = [
  { href: '/admin/dashboard', label: 'Inicio' },
  { href: '/admin/localities', label: 'Localidades' },
  { href: '/admin/mensajes', label: 'Mensajes' },
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
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-terracota sticky top-0 z-30">
        <Link href="/admin/dashboard" className="flex items-center gap-2 no-underline">
          <FlowerIcon size={22} />
          <span
            className="text-papel text-sm font-bold marca"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Tú no me olvides
          </span>
          <span className="text-sobre-terracota/75 text-xs">· Admin</span>
        </Link>
        <AdminMobileMenu items={navLinks} userEmail={userEmail} />
      </header>

      {/* Barra lateral (solo escritorio) */}
      <aside className="hidden lg:flex w-56 bg-terracota flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-black/15">
          <div className="mb-2">
            <FlowerIcon size={28} />
          </div>
          <span
            className="text-papel text-sm font-bold marca"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Tú no me olvides
          </span>
          <p className="text-sobre-terracota/75 text-xs mt-0.5">Panel de administración</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-sm text-sobre-terracota hover:bg-black/10 rounded-marca transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Usuario + mi cuenta + cerrar sesión */}
        <div className="px-3 py-4 border-t border-black/15">
          <p className="px-4 text-xs text-sobre-terracota/75 truncate mb-2">{userEmail}</p>
          <Link
            href="/admin/cuenta"
            className="block px-4 py-2 text-sm text-sobre-terracota hover:bg-black/10 rounded-marca transition-colors"
          >
            Mi cuenta
          </Link>
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

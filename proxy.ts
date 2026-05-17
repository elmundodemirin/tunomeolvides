import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas del panel de administración: autenticación obligatoria
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next()

    // Cliente Supabase en contexto de middleware (cookies de la request)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Rutas que NO exigen sesión cookie aún:
    //  - /admin/login: la propia pantalla de login
    //  - /admin/set-password: aterrizaje de invitación / recuperación de contraseña.
    //    Supabase devuelve los tokens en el hash de la URL (#access_token=...),
    //    que el server NUNCA ve. La sesión se establece en cliente y luego
    //    se guarda en cookie. Si bloqueamos aquí, el flujo se rompe.
    const PUBLIC_ADMIN_PATHS = new Set(['/admin/login', '/admin/set-password'])

    // getUser() valida el token contra Supabase Auth (más seguro que getSession)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !PUBLIC_ADMIN_PATHS.has(pathname)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (user && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return response
  }

  // Resto de rutas: middleware de i18n (next-intl)
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}

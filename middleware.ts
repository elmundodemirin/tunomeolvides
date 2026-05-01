import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
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

    // getUser() valida el token contra Supabase Auth (más seguro que getSession)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user && pathname !== '/admin/login') {
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

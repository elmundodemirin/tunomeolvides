'use client'

import { useEffect } from 'react'

// Red de seguridad para los flujos de auth de Supabase que aterrizan en
// el dominio raíz en vez de en /admin/set-password.
//
// Pasa, por ejemplo, cuando el "Send password recovery" del dashboard
// de Supabase usa la Site URL del proyecto (https://tunomeolvides.es)
// como redirect, ignorando nuestra ruta. Sin esto, los tokens del
// hash o el code PKCE se pierden porque la home no los procesa.
//
// Si detecta cualquier indicio de callback de auth en la URL actual,
// reenvía a /admin/set-password preservando la query y el hash.
export function AuthRedirectGuard() {
  useEffect(() => {
    // /admin/* ya gestiona su propia auth, no interceptamos ahí.
    if (window.location.pathname.startsWith('/admin/')) return

    const hash = window.location.hash
    const hasAuthHash = /(?:^|[#&])(access_token|error_code|error)=/.test(hash)

    const params = new URLSearchParams(window.location.search)
    const hasPkceCode = params.has('code')

    if (!hasAuthHash && !hasPkceCode) return

    const target = '/admin/set-password' + window.location.search + hash
    window.location.replace(target)
  }, [])

  return null
}

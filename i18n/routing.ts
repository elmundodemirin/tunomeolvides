import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en', 'fr'],
  defaultLocale: 'es',
  localePrefix: 'as-needed', // /es is omitted, /en and /fr are explicit
  localeDetection: false,    // no detectar idioma del navegador; español por defecto
})

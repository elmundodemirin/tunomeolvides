import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed', // /es is omitted, /en is explicit
  localeDetection: false,    // no detectar idioma del navegador; español por defecto
})

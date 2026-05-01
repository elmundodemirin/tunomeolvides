'use client'

import { useEffect } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

type Props = { locale: string }

export function CookieBanner({ locale }: Props) {
  useEffect(() => {
    CookieConsent.run({
      // Cuando cambie el consentimiento, activar/desactivar servicios
      onFirstConsent: ({ cookie }) => {
        if (cookie.categories.includes('analytics')) {
          enableAnalytics()
        }
      },
      onChange: ({ cookie }) => {
        if (cookie.categories.includes('analytics')) {
          enableAnalytics()
        } else {
          disableAnalytics()
        }
      },

      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          // Elimina las cookies de GA4 si el usuario retira el consentimiento
          autoClear: {
            cookies: [
              { name: /^_ga/ },
              { name: '_gid' },
            ],
          },
        },
      },

      language: {
        default: locale === 'en' ? 'en' : locale === 'fr' ? 'fr' : 'es',
        translations: {
          es: {
            consentModal: {
              title: 'Usamos cookies',
              description:
                'Utilizamos cookies necesarias para el funcionamiento del sitio y, con tu consentimiento, cookies analíticas para entender cómo se usa la plataforma. No compartimos tus datos con terceros. <a href="/politica-de-cookies" class="cc__link">Más información</a>.',
              acceptAllBtn: 'Aceptar todas',
              acceptNecessaryBtn: 'Solo necesarias',
              showPreferencesBtn: 'Gestionar',
            },
            preferencesModal: {
              title: 'Preferencias de cookies',
              acceptAllBtn: 'Aceptar todas',
              acceptNecessaryBtn: 'Rechazar todas',
              savePreferencesBtn: 'Guardar preferencias',
              closeIconLabel: 'Cerrar',
              sections: [
                {
                  title: 'Cookies necesarias',
                  description:
                    'Estas cookies son imprescindibles para el funcionamiento del sitio. No pueden desactivarse.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Cookies analíticas',
                  description:
                    'Nos permiten conocer cómo interactúas con el sitio (páginas visitadas, tiempo de navegación). Usamos Google Analytics 4 con IP anonimizada. Los datos se almacenan en servidores europeos.',
                  linkedCategory: 'analytics',
                },
              ],
            },
          },
          en: {
            consentModal: {
              title: 'We use cookies',
              description:
                'We use necessary cookies to make the site work and, with your consent, analytics cookies to understand how the platform is used. We do not share your data with third parties. <a href="/en/cookie-policy" class="cc__link">Learn more</a>.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Necessary only',
              showPreferencesBtn: 'Manage',
            },
            preferencesModal: {
              title: 'Cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Necessary cookies',
                  description:
                    'These cookies are essential for the site to function. They cannot be disabled.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analytics cookies',
                  description:
                    'Allow us to understand how you interact with the site (pages visited, time spent). We use Google Analytics 4 with anonymised IP. Data is stored on European servers.',
                  linkedCategory: 'analytics',
                },
              ],
            },
          },
          fr: {
            consentModal: {
              title: 'Nous utilisons des cookies',
              description:
                'Nous utilisons des cookies nécessaires au fonctionnement du site et, avec votre accord, des cookies analytiques pour comprendre l\'utilisation de la plateforme. Nous ne partageons pas vos données avec des tiers. <a href="/fr/politique-cookies" class="cc__link">En savoir plus</a>.',
              acceptAllBtn: 'Tout accepter',
              acceptNecessaryBtn: 'Nécessaires uniquement',
              showPreferencesBtn: 'Gérer',
            },
            preferencesModal: {
              title: 'Préférences de cookies',
              acceptAllBtn: 'Tout accepter',
              acceptNecessaryBtn: 'Tout refuser',
              savePreferencesBtn: 'Enregistrer les préférences',
              closeIconLabel: 'Fermer',
              sections: [
                {
                  title: 'Cookies nécessaires',
                  description:
                    'Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Cookies analytiques',
                  description:
                    'Ils nous permettent de comprendre comment vous interagissez avec le site (pages visitées, temps de navigation). Nous utilisons Google Analytics 4 avec IP anonymisée. Les données sont stockées sur des serveurs européens.',
                  linkedCategory: 'analytics',
                },
              ],
            },
          },
        },
      },
    })
  }, [locale])

  return null
}

// ── GA4 ───────────────────────────────────────────────────────────────────────
// Cuando se disponga del Measurement ID, descomenta estas funciones
// y añade NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX en .env.local y Vercel.

function enableAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID
  if (!id || typeof window === 'undefined') return
  if (document.getElementById('ga4-script')) return // ya cargado

  // Cargar gtag.js
  const script = document.createElement('script')
  script.id = 'ga4-script'
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  script.async = true
  document.head.appendChild(script)

  // Inicializar con IP anonimizada
  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) { window.dataLayer.push(args) }
  gtag('js', new Date())
  gtag('config', id, { anonymize_ip: true })
}

function disableAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID
  if (!id || typeof window === 'undefined') return
  // Deshabilitar GA4 para esta sesión
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true
}

// Extensión del tipo Window para dataLayer de GA4
declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

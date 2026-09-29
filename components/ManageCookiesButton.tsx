'use client'

import * as CookieConsent from 'vanilla-cookieconsent'

export function ManageCookiesButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => CookieConsent.showPreferences()}
      className="hover:text-terracota transition-colors underline-offset-2 hover:underline"
    >
      {label}
    </button>
  )
}

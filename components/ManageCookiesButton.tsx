'use client'

import * as CookieConsent from 'vanilla-cookieconsent'

export function ManageCookiesButton({ label, className }: { label: string; className?: string }) {
  return (
    <button
      onClick={() => CookieConsent.showPreferences()}
      className={className ?? 'hover:text-terracota transition-colors underline-offset-2 hover:underline'}
    >
      {label}
    </button>
  )
}

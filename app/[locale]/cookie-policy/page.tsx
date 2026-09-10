import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { ManageCookiesButton } from '@/components/ManageCookiesButton'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  page: 'cookiePolicy',
  locale: 'en',
  title: 'Cookie policy',
  description: 'What cookies No Me Olvides uses, why, and how you can manage your preferences.',
})

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie policy">

      <p>
        In compliance with Article 22.2 of Spanish Law 34/2002 (LSSI-CE) and the AEPD Cookie
        Guidelines (2023), we inform you about the cookies used on this website.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files that websites store on your device when you visit them. They allow
        the site to remember your preferences and analyse how the platform is used.
      </p>

      <h2>2. Cookies we use</h2>

      <h3>Necessary cookies (always active)</h3>
      <p>Essential for the site to function. They cannot be disabled.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-[#EFE8D6] rounded-lg overflow-hidden">
          <thead className="bg-[#EFE8D6]">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Name</th>
              <th className="text-left px-4 py-2 font-semibold">Provider</th>
              <th className="text-left px-4 py-2 font-semibold">Purpose</th>
              <th className="text-left px-4 py-2 font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE8D6]">
            <tr>
              <td className="px-4 py-2 font-mono text-xs">sb-*</td>
              <td className="px-4 py-2">Supabase</td>
              <td className="px-4 py-2">Admin session (only affects the private panel)</td>
              <td className="px-4 py-2">Session</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs">cc_cookie</td>
              <td className="px-4 py-2">This site</td>
              <td className="px-4 py-2">Stores your cookie preferences</td>
              <td className="px-4 py-2">6 months</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Analytics cookies (require consent)</h3>
      <p>Only installed if you accept analytics cookies. Allow us to understand how the site is used.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-[#EFE8D6] rounded-lg overflow-hidden">
          <thead className="bg-[#EFE8D6]">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Name</th>
              <th className="text-left px-4 py-2 font-semibold">Provider</th>
              <th className="text-left px-4 py-2 font-semibold">Purpose</th>
              <th className="text-left px-4 py-2 font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE8D6]">
            <tr>
              <td className="px-4 py-2 font-mono text-xs">_ga</td>
              <td className="px-4 py-2">Google Analytics</td>
              <td className="px-4 py-2">Distinguishes unique users (anonymous ID)</td>
              <td className="px-4 py-2">2 years</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs">_ga_XXXX</td>
              <td className="px-4 py-2">Google Analytics</td>
              <td className="px-4 py-2">Maintains analytics session state</td>
              <td className="px-4 py-2">2 years</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs">_gid</td>
              <td className="px-4 py-2">Google Analytics</td>
              <td className="px-4 py-2">Distinguishes users (short session)</td>
              <td className="px-4 py-2">24 hours</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Managing your preferences</h2>
      <p>You can change your cookie preferences at any time:</p>
      <ul>
        <li>
          <strong>From this site:</strong>{' '}
          <ManageCookiesButton label="open preferences panel" />
        </li>
        <li>
          <strong>From your browser:</strong> consult your browser&apos;s help to block or delete
          cookies (Chrome, Firefox, Safari, Edge).
        </li>
      </ul>
      <p>
        Withdrawing consent does not affect the lawfulness of processing carried out before withdrawal.
        When analytics cookie consent is withdrawn, these cookies will be automatically deleted from
        your device.
      </p>

      <p className="text-xs text-[#a07860] mt-8">Last updated: May 2026</p>
    </LegalPage>
  )
}

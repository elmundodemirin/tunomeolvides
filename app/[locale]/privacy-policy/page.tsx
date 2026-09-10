import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { PrivacyContent } from '@/components/PrivacyContent'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  page: 'privacy',
  locale: 'en',
  title: 'Privacy policy',
  description: 'How No Me Olvides collects, processes and protects your personal data, in compliance with the GDPR.',
})

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy policy">
      <PrivacyContent locale="en" />
    </LegalPage>
  )
}

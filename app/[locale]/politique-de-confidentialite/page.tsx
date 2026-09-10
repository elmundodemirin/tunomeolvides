import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { PrivacyContent } from '@/components/PrivacyContent'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  page: 'privacy',
  locale: 'fr',
  title: 'Politique de confidentialité',
  description: 'Comment No Me Olvides collecte, traite et protège vos données personnelles, conformément au RGPD.',
})

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <PrivacyContent locale="fr" />
    </LegalPage>
  )
}

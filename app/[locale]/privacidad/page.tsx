import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { PrivacyContent } from '@/components/PrivacyContent'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  page: 'privacy',
  locale: 'es',
  title: 'Política de privacidad',
  description: 'Cómo No Me Olvides recoge, trata y protege tus datos personales, conforme al RGPD.',
})

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <PrivacyContent locale="es" />
    </LegalPage>
  )
}

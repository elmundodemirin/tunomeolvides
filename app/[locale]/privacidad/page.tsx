import { LegalPage } from '@/components/LegalPage'
import { PrivacyContent } from '@/components/PrivacyContent'

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <PrivacyContent locale="es" />
    </LegalPage>
  )
}

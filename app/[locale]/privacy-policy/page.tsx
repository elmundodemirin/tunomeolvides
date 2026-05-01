import { LegalPage } from '@/components/LegalPage'
import { PrivacyContent } from '@/components/PrivacyContent'

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy policy">
      <PrivacyContent locale="en" />
    </LegalPage>
  )
}

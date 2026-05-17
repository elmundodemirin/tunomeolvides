import { LegalPage } from '@/components/LegalPage'

export default function LegalNoticePage() {
  return (
    <LegalPage title="Legal notice">

      <h2>1. Website owner</h2>
      <p>In compliance with Article 10 of Spanish Law 34/2002 on Information Society Services (LSSI-CE):</p>
      <ul>
        <li><strong>Owner:</strong> María del Carmen López Rosa</li>
        <li><strong>Tax ID (NIF):</strong> 51089277K</li>
        <li><strong>Address:</strong> C/Antonio López Aguado 1</li>
        <li><strong>Email:</strong> info@tunomeolvides.es</li>
        <li><strong>Website:</strong> [domain pending confirmation]</li>
      </ul>

      <h2>2. Purpose and activity</h2>
      <p>
        <em>No Me Olvides</em> is a non-commercial cultural information platform whose purpose is
        to document and preserve the cultural heritage of depopulated rural Spanish municipalities
        through an interactive map with first-person audio narratives. No commercial activity is
        carried out and no goods or services are sold.
      </p>

      <h2>3. Intellectual and industrial property</h2>
      <p>
        All content on this website — texts, images, audio files, graphic design and source code —
        is the property of María del Carmen López Rosa or their respective authors, and is protected
        by Spanish and international intellectual and industrial property law.
      </p>
      <p>
        Reproduction, distribution, public communication or transformation without express written
        authorisation from the owner is prohibited, except where expressly permitted by law.
      </p>

      <h2>4. Liability</h2>
      <p>
        The owner does not guarantee the absence of interruptions or errors in access to the site or
        its content, although every effort will be made to avoid them. The owner accepts no liability
        for any damage or loss arising from the use of this site or any linked sites.
      </p>

      <h2>5. Applicable law and jurisdiction</h2>
      <p>
        These terms are governed by Spanish law. For the resolution of any dispute, the parties submit
        to the courts of the owner&apos;s place of domicile, expressly waiving any other jurisdiction.
      </p>

      <p className="text-xs text-[#a07860] mt-8">Last updated: May 2026</p>
    </LegalPage>
  )
}

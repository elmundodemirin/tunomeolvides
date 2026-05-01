import { LegalPage } from '@/components/LegalPage'

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy policy">

      <p>
        In compliance with Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018 on Personal
        Data Protection (LOPDGDD), we inform you about the processing of your personal data.
      </p>

      <h2>1. Data controller</h2>
      <ul>
        <li><strong>Identity:</strong> María del Carmen López Rosa</li>
        <li><strong>Tax ID (NIF):</strong> [TO BE COMPLETED]</li>
        <li><strong>Address:</strong> [TO BE COMPLETED]</li>
        <li><strong>Email:</strong> info@nomeolvides.es</li>
      </ul>

      <h2>2. Data we process and purposes</h2>

      <h3>a) Contact form</h3>
      <ul>
        <li><strong>Data:</strong> name, email address and message.</li>
        <li><strong>Purpose:</strong> responding to your enquiry or collaboration request.</li>
        <li><strong>Legal basis:</strong> consent of the data subject (Art. 6.1.a GDPR).</li>
        <li><strong>Retention period:</strong> 2 years from receipt, after which data is automatically deleted.</li>
      </ul>

      <h3>b) Administration panel</h3>
      <ul>
        <li><strong>Data:</strong> email address and password (encrypted) of administrators.</li>
        <li><strong>Purpose:</strong> managing access to the content panel.</li>
        <li><strong>Legal basis:</strong> legitimate interest of the controller (Art. 6.1.f GDPR).</li>
        <li><strong>Retention period:</strong> while the account remains active.</li>
      </ul>

      <h3>c) Analytics cookies (Google Analytics 4)</h3>
      <ul>
        <li><strong>Data:</strong> anonymised browsing data (pages visited, time on site). IP addresses are anonymised before any storage.</li>
        <li><strong>Purpose:</strong> statistical analysis of platform usage to improve the service.</li>
        <li><strong>Legal basis:</strong> consent of the data subject (Art. 6.1.a GDPR). <strong>Google Analytics does not load until the user accepts analytics cookies.</strong></li>
        <li><strong>Retention period:</strong> 14 months (GA4 default configuration).</li>
      </ul>

      <h2>3. Recipients of data</h2>
      <p>Data is stored on <strong>Supabase</strong> (Supabase Ireland Ltd.) servers hosted in the <strong>eu-central-1 (Frankfurt, Germany)</strong> region, within EU territory. No international transfers outside the EEA take place.</p>
      <p>If analytics cookies are activated, anonymised browsing data is transmitted to <strong>Google Ireland Limited</strong> (Dublin, Ireland), with adequate guarantees under EU standard contractual clauses.</p>
      <p>We do not share personal data with third parties except where required by law.</p>

      <h2>4. Your rights</h2>
      <p>You may exercise the following rights at any time by writing to <strong>info@nomeolvides.es</strong>:</p>
      <ul>
        <li><strong>Access:</strong> know what data we process about you.</li>
        <li><strong>Rectification:</strong> correct inaccurate or incomplete data.</li>
        <li><strong>Erasure:</strong> request deletion of your data.</li>
        <li><strong>Portability:</strong> receive your data in a structured format.</li>
        <li><strong>Restriction:</strong> request restriction of processing.</li>
        <li><strong>Objection:</strong> object to processing based on legitimate interest.</li>
        <li><strong>Withdrawal of consent:</strong> at any time, without retroactive effect.</li>
      </ul>
      <p>
        If you believe your rights have not been respected, you may lodge a complaint with the
        <strong> Spanish Data Protection Agency (AEPD)</strong> at{' '}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#C9633E] hover:underline">
          www.aepd.es
        </a>.
      </p>

      <p className="text-xs text-[#a07860] mt-8">Last updated: May 2026</p>
    </LegalPage>
  )
}

// Contenido de la política de privacidad — fuente única reutilizada por
// las páginas /privacidad y /privacy-policy y por el modal del formulario.

export function PrivacyContent({ locale }: { locale: string }) {
  if (locale === 'en') return <PrivacyContentEN />
  if (locale === 'fr') return <PrivacyContentFR />
  return <PrivacyContentES />
}

function PrivacyContentES() {
  return (
    <>
      <p>
        En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección
        de Datos Personales y garantía de los derechos digitales (LOPDGDD), le informamos sobre el
        tratamiento de sus datos personales.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Identidad:</strong> María del Carmen López Rosa</li>
        <li><strong>NIF:</strong> [COMPLETAR]</li>
        <li><strong>Dirección:</strong> [COMPLETAR]</li>
        <li><strong>Correo:</strong> info@tunomeolvides.es</li>
      </ul>

      <h2>2. Datos que tratamos y finalidades</h2>

      <h3>a) Formulario de contacto</h3>
      <ul>
        <li><strong>Datos:</strong> nombre, correo electrónico y mensaje.</li>
        <li><strong>Finalidad:</strong> atender su consulta o colaboración.</li>
        <li><strong>Base jurídica:</strong> consentimiento del interesado (art. 6.1.a RGPD).</li>
        <li><strong>Plazo de conservación:</strong> 2 años desde la recepción del mensaje, tras los cuales se eliminan automáticamente.</li>
      </ul>

      <h3>b) Panel de administración</h3>
      <ul>
        <li><strong>Datos:</strong> correo electrónico y contraseña (cifrada) de los administradores.</li>
        <li><strong>Finalidad:</strong> gestión del acceso al panel de contenidos.</li>
        <li><strong>Base jurídica:</strong> interés legítimo del responsable (art. 6.1.f RGPD).</li>
        <li><strong>Plazo de conservación:</strong> mientras la cuenta esté activa.</li>
      </ul>

      <h3>c) Cookies analíticas (Google Analytics 4)</h3>
      <ul>
        <li><strong>Datos:</strong> datos de navegación anonimizados (páginas visitadas, tiempo de visita). La dirección IP se anonimiza antes de cualquier almacenamiento.</li>
        <li><strong>Finalidad:</strong> análisis estadístico del uso de la plataforma para mejorar el servicio.</li>
        <li><strong>Base jurídica:</strong> consentimiento del interesado (art. 6.1.a RGPD). <strong>Google Analytics no se carga hasta que el usuario acepta las cookies analíticas.</strong></li>
        <li><strong>Plazo de conservación:</strong> 14 meses (configuración por defecto de GA4).</li>
      </ul>

      <h2>3. Destinatarios de los datos</h2>
      <p>Los datos se almacenan en los servidores de <strong>Supabase</strong> (Supabase Ireland Ltd.), alojados en la región <strong>eu-central-1 (Fráncfort, Alemania)</strong>, dentro del territorio de la Unión Europea. No se realizan transferencias internacionales de datos fuera del EEE.</p>
      <p>En el caso de activar las cookies analíticas, los datos anonimizados de navegación se transmiten a <strong>Google Ireland Limited</strong> (Dublin, Irlanda), con adecuadas garantías en virtud de las cláusulas contractuales tipo de la UE.</p>
      <p>No cedemos datos personales a terceros salvo obligación legal.</p>

      <h2>4. Derechos del interesado</h2>
      <p>Puede ejercer en cualquier momento los siguientes derechos dirigiendo un escrito a <strong>info@tunomeolvides.es</strong>:</p>
      <ul>
        <li><strong>Acceso:</strong> conocer qué datos tratamos sobre usted.</li>
        <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
        <li><strong>Supresión:</strong> solicitar la eliminación de sus datos.</li>
        <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado.</li>
        <li><strong>Limitación:</strong> solicitar la limitación del tratamiento.</li>
        <li><strong>Oposición:</strong> oponerse al tratamiento basado en interés legítimo.</li>
        <li><strong>Retirada del consentimiento:</strong> en cualquier momento, sin efecto retroactivo.</li>
      </ul>
      <p>
        Si considera que sus derechos no han sido atendidos, puede presentar una reclamación ante la
        <strong> Agencia Española de Protección de Datos (AEPD)</strong> en{' '}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#C9633E] hover:underline">
          www.aepd.es
        </a>.
      </p>

      <p className="text-xs text-[#a07860] mt-8">Última actualización: mayo de 2026</p>
    </>
  )
}

function PrivacyContentEN() {
  return (
    <>
      <p>
        In compliance with Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law 3/2018 on Personal
        Data Protection (LOPDGDD), we inform you about the processing of your personal data.
      </p>

      <h2>1. Data controller</h2>
      <ul>
        <li><strong>Identity:</strong> María del Carmen López Rosa</li>
        <li><strong>Tax ID (NIF):</strong> [TO BE COMPLETED]</li>
        <li><strong>Address:</strong> [TO BE COMPLETED]</li>
        <li><strong>Email:</strong> info@tunomeolvides.es</li>
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
      <p>You may exercise the following rights at any time by writing to <strong>info@tunomeolvides.es</strong>:</p>
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
    </>
  )
}

function PrivacyContentFR() {
  return (
    <>
      <p>
        Conformément au Règlement (UE) 2016/679 (RGPD) et à la Loi organique espagnole 3/2018 sur la
        protection des données personnelles et la garantie des droits numériques (LOPDGDD), nous vous
        informons sur le traitement de vos données personnelles.
      </p>

      <h2>1. Responsable du traitement</h2>
      <ul>
        <li><strong>Identité :</strong> María del Carmen López Rosa</li>
        <li><strong>Numéro fiscal (NIF) :</strong> [À COMPLÉTER]</li>
        <li><strong>Adresse :</strong> [À COMPLÉTER]</li>
        <li><strong>E-mail :</strong> info@tunomeolvides.es</li>
      </ul>

      <h2>2. Données traitées et finalités</h2>

      <h3>a) Formulaire de contact</h3>
      <ul>
        <li><strong>Données :</strong> nom, adresse e-mail et message.</li>
        <li><strong>Finalité :</strong> répondre à votre demande ou proposition de collaboration.</li>
        <li><strong>Base juridique :</strong> consentement de la personne concernée (art. 6.1.a RGPD).</li>
        <li><strong>Durée de conservation :</strong> 2 ans à compter de la réception, après quoi les données sont supprimées automatiquement.</li>
      </ul>

      <h3>b) Panneau d'administration</h3>
      <ul>
        <li><strong>Données :</strong> adresse e-mail et mot de passe (chiffré) des administrateurs.</li>
        <li><strong>Finalité :</strong> gérer l'accès au panneau de contenu.</li>
        <li><strong>Base juridique :</strong> intérêt légitime du responsable (art. 6.1.f RGPD).</li>
        <li><strong>Durée de conservation :</strong> tant que le compte reste actif.</li>
      </ul>

      <h3>c) Cookies analytiques (Google Analytics 4)</h3>
      <ul>
        <li><strong>Données :</strong> données de navigation anonymisées (pages visitées, temps passé). Les adresses IP sont anonymisées avant tout stockage.</li>
        <li><strong>Finalité :</strong> analyse statistique de l'utilisation de la plateforme pour améliorer le service.</li>
        <li><strong>Base juridique :</strong> consentement de la personne concernée (art. 6.1.a RGPD). <strong>Google Analytics ne se charge pas tant que l'utilisateur n'accepte pas les cookies analytiques.</strong></li>
        <li><strong>Durée de conservation :</strong> 14 mois (configuration par défaut de GA4).</li>
      </ul>

      <h2>3. Destinataires des données</h2>
      <p>Les données sont stockées sur les serveurs de <strong>Supabase</strong> (Supabase Ireland Ltd.) hébergés dans la région <strong>eu-central-1 (Francfort, Allemagne)</strong>, sur le territoire de l'Union européenne. Aucun transfert international hors de l'EEE n'est effectué.</p>
      <p>Si les cookies analytiques sont activés, les données de navigation anonymisées sont transmises à <strong>Google Ireland Limited</strong> (Dublin, Irlande), avec des garanties adéquates en vertu des clauses contractuelles types de l'UE.</p>
      <p>Nous ne partageons pas de données personnelles avec des tiers, sauf obligation légale.</p>

      <h2>4. Vos droits</h2>
      <p>Vous pouvez exercer à tout moment les droits suivants en écrivant à <strong>info@tunomeolvides.es</strong> :</p>
      <ul>
        <li><strong>Accès :</strong> connaître les données que nous traitons à votre sujet.</li>
        <li><strong>Rectification :</strong> corriger les données inexactes ou incomplètes.</li>
        <li><strong>Effacement :</strong> demander la suppression de vos données.</li>
        <li><strong>Portabilité :</strong> recevoir vos données dans un format structuré.</li>
        <li><strong>Limitation :</strong> demander la limitation du traitement.</li>
        <li><strong>Opposition :</strong> vous opposer au traitement fondé sur l'intérêt légitime.</li>
        <li><strong>Retrait du consentement :</strong> à tout moment, sans effet rétroactif.</li>
      </ul>
      <p>
        Si vous estimez que vos droits n'ont pas été respectés, vous pouvez déposer une réclamation
        auprès de l'<strong>Agence espagnole de protection des données (AEPD)</strong> sur{' '}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#C9633E] hover:underline">
          www.aepd.es
        </a>.
      </p>

      <p className="text-xs text-[#a07860] mt-8">Dernière mise à jour : mai 2026</p>
    </>
  )
}

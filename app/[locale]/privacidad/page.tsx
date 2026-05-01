import { LegalPage } from '@/components/LegalPage'

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">

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
        <li><strong>Correo:</strong> info@nomeolvides.es</li>
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
      <p>Puede ejercer en cualquier momento los siguientes derechos dirigiendo un escrito a <strong>info@nomeolvides.es</strong>:</p>
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
    </LegalPage>
  )
}

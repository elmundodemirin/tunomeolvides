import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  page: 'legalNotice',
  locale: 'es',
  title: 'Aviso legal',
  description: 'Datos identificativos, condiciones de uso y régimen de responsabilidad del sitio web No Me Olvides.',
})

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal">

      <h2>1. Datos identificativos del titular</h2>
      <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa:</p>
      <ul>
        <li><strong>Titular:</strong> María del Carmen López Rosa</li>
        <li><strong>NIF:</strong> 51089277K</li>
        <li><strong>Domicilio:</strong> C/Antonio López Aguado 1</li>
        <li><strong>Correo electrónico:</strong> info@tunomeolvides.es</li>
        <li><strong>Sitio web:</strong> tunomeolvides.es</li>
      </ul>

      <h2>2. Objeto y actividad</h2>
      <p>
        <em>No Me Olvides</em> es una plataforma cultural informativa sin ánimo de lucro cuyo objeto
        es documentar y preservar el patrimonio cultural de los municipios de la España vaciada mediante
        un mapa interactivo con audios narrados en primera persona. No se realiza actividad comercial
        ni se venden bienes o servicios.
      </p>

      <h2>3. Propiedad intelectual e industrial</h2>
      <p>
        Todos los contenidos del sitio web —textos, imágenes, audios, diseño gráfico y código fuente—
        son propiedad de María del Carmen López Rosa o de sus autores respectivos, y están protegidos
        por la legislación española e internacional sobre propiedad intelectual e industrial.
      </p>
      <p>
        Queda prohibida su reproducción, distribución, comunicación pública o transformación sin
        autorización expresa y por escrito del titular, salvo que la ley lo permita expresamente.
      </p>

      <h2>4. Responsabilidad</h2>
      <p>
        El titular no garantiza la ausencia de interrupciones o errores en el acceso al sitio ni en
        sus contenidos, aunque pondrá su mejor esfuerzo en evitarlos. El titular no se responsabiliza
        de los daños o perjuicios derivados del uso del sitio o de los sitios enlazados desde el mismo.
      </p>

      <h2>5. Legislación aplicable y jurisdicción</h2>
      <p>
        Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier
        controversia, las partes se someten a los juzgados y tribunales del domicilio del titular,
        con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
      </p>

      <p className="text-xs text-[#a07860] mt-8">Última actualización: mayo de 2026</p>
    </LegalPage>
  )
}

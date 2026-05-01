import { LegalPage } from '@/components/LegalPage'
import { ManageCookiesButton } from '@/components/ManageCookiesButton'

export default function PoliticaCookiesPage() {
  return (
    <LegalPage title="Política de cookies">

      <p>
        En cumplimiento de lo dispuesto en el artículo 22.2 de la LSSI-CE y la Guía sobre el uso
        de las cookies de la AEPD (2023), le informamos sobre las cookies que utiliza este sitio web.
      </p>

      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo al
        visitarlos. Permiten que el sitio recuerde sus preferencias y analice cómo se usa la plataforma.
      </p>

      <h2>2. Cookies que utilizamos</h2>

      <h3>Cookies necesarias (siempre activas)</h3>
      <p>Son imprescindibles para el funcionamiento del sitio. No pueden desactivarse.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-[#EFE8D6] rounded-lg overflow-hidden">
          <thead className="bg-[#EFE8D6]">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Nombre</th>
              <th className="text-left px-4 py-2 font-semibold">Proveedor</th>
              <th className="text-left px-4 py-2 font-semibold">Finalidad</th>
              <th className="text-left px-4 py-2 font-semibold">Duración</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE8D6]">
            <tr>
              <td className="px-4 py-2 font-mono text-xs">sb-*</td>
              <td className="px-4 py-2">Supabase</td>
              <td className="px-4 py-2">Sesión de administración (solo afecta al panel privado)</td>
              <td className="px-4 py-2">Sesión</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs">cc_cookie</td>
              <td className="px-4 py-2">Este sitio</td>
              <td className="px-4 py-2">Guarda sus preferencias de cookies</td>
              <td className="px-4 py-2">6 meses</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Cookies analíticas (requieren consentimiento)</h3>
      <p>Solo se instalan si acepta las cookies analíticas. Permiten conocer cómo se usa el sitio.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-[#EFE8D6] rounded-lg overflow-hidden">
          <thead className="bg-[#EFE8D6]">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Nombre</th>
              <th className="text-left px-4 py-2 font-semibold">Proveedor</th>
              <th className="text-left px-4 py-2 font-semibold">Finalidad</th>
              <th className="text-left px-4 py-2 font-semibold">Duración</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE8D6]">
            <tr>
              <td className="px-4 py-2 font-mono text-xs">_ga</td>
              <td className="px-4 py-2">Google Analytics</td>
              <td className="px-4 py-2">Distingue usuarios únicos (ID anónimo)</td>
              <td className="px-4 py-2">2 años</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs">_ga_XXXX</td>
              <td className="px-4 py-2">Google Analytics</td>
              <td className="px-4 py-2">Mantiene el estado de sesión analítica</td>
              <td className="px-4 py-2">2 años</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs">_gid</td>
              <td className="px-4 py-2">Google Analytics</td>
              <td className="px-4 py-2">Distingue usuarios (sesión corta)</td>
              <td className="px-4 py-2">24 horas</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm">
        Las IPs se anonimizan antes de cualquier procesamiento. Google Analytics no recibe datos
        personales identificables. Más información en la{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9633E] hover:underline">
          política de privacidad de Google
        </a>.
      </p>

      <h2>3. Cómo gestionar sus preferencias</h2>
      <p>Puede cambiar sus preferencias de cookies en cualquier momento:</p>
      <ul>
        <li>
          <strong>Desde este sitio:</strong>{' '}
          <ManageCookiesButton label="abrir panel de preferencias" />
        </li>
        <li>
          <strong>Desde su navegador:</strong> consulte la ayuda de su navegador para bloquear o
          eliminar cookies (Chrome, Firefox, Safari, Edge).
        </li>
      </ul>
      <p>
        Retirar el consentimiento no afecta a la licitud del tratamiento realizado antes de la retirada.
        Al retirar el consentimiento de las cookies analíticas, estas se eliminarán automáticamente
        de su dispositivo.
      </p>

      <p className="text-xs text-[#a07860] mt-8">Última actualización: mayo de 2026</p>
    </LegalPage>
  )
}

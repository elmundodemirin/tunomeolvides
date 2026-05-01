import { LegalPage } from '@/components/LegalPage'
import { ManageCookiesButton } from '@/components/ManageCookiesButton'

export default function PolitiqueCookiesPage() {
  return (
    <LegalPage title="Politique relative aux cookies">

      <p>
        Conformément à l'article 22.2 de la loi espagnole LSSI-CE et au guide de l'AEPD sur l'utilisation
        des cookies (2023), nous vous informons des cookies utilisés par ce site web.
      </p>

      <h2>1. Qu'est-ce qu'un cookie ?</h2>
      <p>
        Les cookies sont de petits fichiers texte que les sites web stockent sur votre appareil lors
        de votre visite. Ils permettent au site de mémoriser vos préférences et d'analyser l'utilisation
        de la plateforme.
      </p>

      <h2>2. Cookies que nous utilisons</h2>

      <h3>Cookies nécessaires (toujours actifs)</h3>
      <p>Ils sont indispensables au fonctionnement du site et ne peuvent être désactivés.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-[#EFE8D6] rounded-lg overflow-hidden">
          <thead className="bg-[#EFE8D6]">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Nom</th>
              <th className="text-left px-4 py-2 font-semibold">Fournisseur</th>
              <th className="text-left px-4 py-2 font-semibold">Finalité</th>
              <th className="text-left px-4 py-2 font-semibold">Durée</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE8D6]">
            <tr>
              <td className="px-4 py-2 font-mono text-xs">sb-*</td>
              <td className="px-4 py-2">Supabase</td>
              <td className="px-4 py-2">Session d'administration (concerne uniquement le panneau privé)</td>
              <td className="px-4 py-2">Session</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs">cc_cookie</td>
              <td className="px-4 py-2">Ce site</td>
              <td className="px-4 py-2">Mémorise vos préférences de cookies</td>
              <td className="px-4 py-2">6 mois</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Cookies analytiques (consentement requis)</h3>
      <p>Ils ne sont installés que si vous acceptez les cookies analytiques. Ils nous permettent de comprendre comment le site est utilisé.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-[#EFE8D6] rounded-lg overflow-hidden">
          <thead className="bg-[#EFE8D6]">
            <tr>
              <th className="text-left px-4 py-2 font-semibold">Nom</th>
              <th className="text-left px-4 py-2 font-semibold">Fournisseur</th>
              <th className="text-left px-4 py-2 font-semibold">Finalité</th>
              <th className="text-left px-4 py-2 font-semibold">Durée</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE8D6]">
            <tr>
              <td className="px-4 py-2 font-mono text-xs">_ga</td>
              <td className="px-4 py-2">Google Analytics</td>
              <td className="px-4 py-2">Distingue les utilisateurs uniques (identifiant anonyme)</td>
              <td className="px-4 py-2">2 ans</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs">_ga_XXXX</td>
              <td className="px-4 py-2">Google Analytics</td>
              <td className="px-4 py-2">Maintient l'état de la session analytique</td>
              <td className="px-4 py-2">2 ans</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs">_gid</td>
              <td className="px-4 py-2">Google Analytics</td>
              <td className="px-4 py-2">Distingue les utilisateurs (session courte)</td>
              <td className="px-4 py-2">24 heures</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm">
        Les adresses IP sont anonymisées avant tout traitement. Google Analytics ne reçoit pas de
        données personnelles identifiables. Plus d'informations dans la{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C9633E] hover:underline">
          politique de confidentialité de Google
        </a>.
      </p>

      <h2>3. Comment gérer vos préférences</h2>
      <p>Vous pouvez modifier vos préférences de cookies à tout moment :</p>
      <ul>
        <li>
          <strong>Depuis ce site :</strong>{' '}
          <ManageCookiesButton label="ouvrir le panneau de préférences" />
        </li>
        <li>
          <strong>Depuis votre navigateur :</strong> consultez l'aide de votre navigateur pour bloquer
          ou supprimer les cookies (Chrome, Firefox, Safari, Edge).
        </li>
      </ul>
      <p>
        Le retrait du consentement n'affecte pas la licéité du traitement effectué avant ce retrait.
        Lorsque vous retirez votre consentement aux cookies analytiques, ceux-ci sont automatiquement
        supprimés de votre appareil.
      </p>

      <p className="text-xs text-[#a07860] mt-8">Dernière mise à jour : mai 2026</p>
    </LegalPage>
  )
}

import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  page: 'legalNotice',
  locale: 'fr',
  title: 'Mentions légales',
  description: "Informations sur l'éditeur, les conditions d'utilisation et la responsabilité du site No Me Olvides.",
})

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales">

      <h2>1. Identification du responsable</h2>
      <p>Conformément à l'article 10 de la loi espagnole 34/2002 du 11 juillet relative aux services de la société de l'information et au commerce électronique (LSSI-CE), il est précisé :</p>
      <ul>
        <li><strong>Responsable :</strong> María del Carmen López Rosa</li>
        <li><strong>Numéro fiscal (NIF) :</strong> 51089277K</li>
        <li><strong>Adresse :</strong> C/Antonio López Aguado 1, 28029 Madrid, Espagne</li>
        <li><strong>E-mail :</strong> info@tunomeolvides.es</li>
        <li><strong>Site web :</strong> tunomeolvides.es</li>
      </ul>

      <h2>2. Objet et activité</h2>
      <p>
        <em>No Me Olvides</em> est une plateforme dédiée à la recherche, la documentation et la
        diffusion du patrimoine culturel des municipalités de l'Espagne rurale. Elle propose des
        services de digitalisation touristique à des entités publiques et privées, notamment le
        développement de sites web touristiques, la production de contenus et des audioguides
        numériques sur place.
      </p>

      <h2>3. Propriété intellectuelle et industrielle</h2>
      <p>
        Tous les contenus du site web — textes, images, fichiers audio, design graphique et code source
        — appartiennent à María del Carmen López Rosa ou à leurs auteurs respectifs et sont protégés
        par la législation espagnole et internationale en matière de propriété intellectuelle et
        industrielle.
      </p>
      <p>
        Toute reproduction, distribution, communication publique ou transformation est interdite sans
        autorisation expresse et écrite du responsable, sauf disposition contraire de la loi.
      </p>

      <h2>4. Responsabilité</h2>
      <p>
        Le responsable ne garantit pas l'absence d'interruptions ou d'erreurs lors de l'accès au site
        ou à ses contenus, mais s'efforcera de les éviter. Le responsable décline toute responsabilité
        en cas de dommages ou préjudices résultant de l'utilisation du site ou des sites liés.
      </p>

      <h2>5. Législation applicable et juridiction</h2>
      <p>
        Les présentes conditions sont régies par la législation espagnole. Pour la résolution de tout
        litige, les parties se soumettent aux tribunaux du domicile du responsable, en renonçant
        expressément à toute autre juridiction susceptible de leur être applicable.
      </p>

      <p className="text-xs text-[#a07860] mt-8">Dernière mise à jour : mai 2026</p>
    </LegalPage>
  )
}

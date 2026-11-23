import Link from 'next/link'
import Image from 'next/image'
import { FlowerIcon } from '@/components/FlowerIcon'

type Props = {
  title: string
  body: string
  cta: string
  homeHref: string
}

// Contenido de la página «no encontrada» (404), compartido por la versión con
// idioma (app/[locale]/not-found.tsx, dentro de la cabecera y el pie) y la de
// respaldo sin idioma (app/not-found.tsx). Logo de la marca arriba y la flor
// junto al botón, como firma.
export function NotFoundContent({ title, body, cta, homeHref }: Props) {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center">
        <div className="relative mx-auto mb-8 w-[220px] h-[135px] sm:w-[260px] sm:h-[159px]">
          <Image
            src="/logo-tunomeolvides-emblema.png"
            alt="Tú no me olvides"
            fill
            priority
            className="object-contain"
          />
        </div>
        <p className="label-marca mb-3" style={{ color: 'var(--color-flower)', textAlign: 'center', textAlignLast: 'center' }}>
          404
        </p>
        <h1
          className="text-3xl sm:text-4xl mb-4 leading-tight"
          style={{ color: 'var(--color-terracota)', fontFamily: 'var(--font-heading)', textAlign: 'center' }}
        >
          {title}
        </h1>
        <p className="mb-10 leading-relaxed" style={{ color: 'var(--color-tinta)', textAlign: 'center', textAlignLast: 'center', hyphens: 'none' }}>
          {body}
        </p>
        <Link
          href={homeHref}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium no-underline transition-opacity hover:opacity-85"
          style={{ backgroundColor: 'var(--color-terracota)', color: 'var(--color-sobre-terracota)' }}
        >
          <FlowerIcon size={22} />
          {cta}
        </Link>
      </div>
    </div>
  )
}

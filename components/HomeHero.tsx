import { existsSync } from 'fs'
import { join } from 'path'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

type Props = { locale: string }

// Primer elemento visible de la home, antes de cualquier otro contenido
// (incluido el mapa). Sostiene el único <h1> de la página.
//
// Imagen de fondo: public/hero-pueblo.png (foto real de un pueblo de la
// España vaciada, proporcionada por la promotora). Si en algún momento no
// existe, se comprueba en el servidor y se usa un degradado de marca como
// respaldo, para no mostrar un icono de imagen rota.
const HERO_IMAGE_EXISTS = existsSync(join(process.cwd(), 'public', 'hero-pueblo.png'))

export async function HomeHero({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'hero' })

  return (
    <div
      className="relative min-h-[85dvh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, var(--color-terracotta-dark), var(--color-sage-dark))',
      }}
    >
      {HERO_IMAGE_EXISTS && (
        <Image
          src="/hero-pueblo.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      {/* Overlay oscuro para que el texto blanco tenga contraste suficiente sobre la foto */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55))' }}
      />

      <div className="relative max-w-3xl mx-auto px-6 py-16 text-center">
        <h1
          className="text-4xl lg:text-6xl leading-tight mb-4 text-white"
          style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
        >
          {t('title')}
        </h1>
        <p className="text-lg lg:text-2xl leading-snug mb-5 text-white">
          {t('subtitle')}
        </p>
        <p className="text-sm lg:text-base leading-relaxed mb-9 max-w-xl mx-auto text-white/85">
          {t('paragraph')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#mapa"
            className="inline-block py-4 px-7 rounded-lg text-white font-medium text-base transition-colors min-h-[48px]"
            style={{ backgroundColor: 'var(--color-terracotta)' }}
          >
            {t('cta1')}
          </a>
          {locale === 'es' && (
            <Link
              href="/ayuntamientos"
              className="inline-block py-4 px-7 rounded-lg font-medium text-base text-white transition-colors border-2 border-white min-h-[48px] backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              ¿Eres un ayuntamiento?
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

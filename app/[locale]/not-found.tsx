import { useLocale, useTranslations } from 'next-intl'
import { NotFoundContent } from '@/components/NotFoundContent'

// Página «no encontrada» dentro de un idioma válido (con cabecera y pie).
// La disparan app/[locale]/[...rest]/page.tsx (rutas que no existen) y
// cualquier notFound() de una página.
export default function LocaleNotFound() {
  const t = useTranslations('notFound')
  const locale = useLocale()
  return (
    <NotFoundContent
      title={t('title')}
      body={t('body')}
      cta={t('cta')}
      homeHref={locale === 'es' ? '/' : `/${locale}`}
    />
  )
}

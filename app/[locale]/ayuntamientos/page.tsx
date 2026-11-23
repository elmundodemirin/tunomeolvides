import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/seo'
import { CouncilsPage, COUNCILS_TEXT } from '@/components/CouncilsPage'

// Versión en español de la página para ayuntamientos. La inglesa vive en
// /en/for-councils (app/[locale]/for-councils) con el mismo componente.

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale !== 'es') return {}
  return buildPageMetadata({
    page: 'councils',
    locale: 'es',
    title: COUNCILS_TEXT.es.metaTitle,
    description: COUNCILS_TEXT.es.metaDescription,
  })
}

export default async function AyuntamientosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'es') notFound()
  return <CouncilsPage locale="es" />
}

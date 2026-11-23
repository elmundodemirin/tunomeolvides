import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/seo'
import { CouncilsPage, COUNCILS_TEXT } from '@/components/CouncilsPage'

// Versión en inglés de la página para ayuntamientos (/en/for-councils). La
// española vive en /ayuntamientos con el mismo componente.

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale !== 'en') return {}
  return buildPageMetadata({
    page: 'councils',
    locale: 'en',
    title: COUNCILS_TEXT.en.metaTitle,
    description: COUNCILS_TEXT.en.metaDescription,
  })
}

export default async function ForCouncilsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== 'en') notFound()
  return <CouncilsPage locale="en" />
}

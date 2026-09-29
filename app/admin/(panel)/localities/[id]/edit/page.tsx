import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { LocalityForm } from '@/components/admin/LocalityForm'
import type { Locality } from '@/lib/types'

export default async function EditLocalityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: locality } = await supabase
    .from('localities')
    .select('*')
    .eq('id', id)
    .single()

  if (!locality) notFound()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-terracota"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Editar: {locality.name}
        </h1>
        <p className="text-sm text-tinta/60 mt-1">
          {locality.province} · {locality.region}
        </p>
      </div>
      <LocalityForm locality={locality as Locality} />
    </div>
  )
}

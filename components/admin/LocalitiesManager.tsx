'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import type { Locality } from '@/lib/types'

type Row = Pick<Locality, 'id' | 'name' | 'province' | 'region' | 'active'>
type Filter = 'all' | 'active' | 'inactive'

type Props = {
  localities: Row[]
}

// Tabla de localidades con filtro por estado y acciones masivas.
// La fuente de los datos sigue siendo el server component (page.tsx);
// este componente cliente gestiona la selección, el filtrado en pantalla
// y los UPDATE masivos vía supabase-js (RLS exige sesión admin).
export function LocalitiesManager({ localities }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirming, setConfirming] = useState<'activate' | 'deactivate' | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const visible = useMemo(() => {
    if (filter === 'active') return localities.filter(l => l.active)
    if (filter === 'inactive') return localities.filter(l => !l.active)
    return localities
  }, [localities, filter])

  function changeFilter(f: Filter) {
    setFilter(f)
    setSelected(new Set()) // limpiar selección al cambiar de filtro
  }

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(prev =>
      prev.size === visible.length ? new Set() : new Set(visible.map(l => l.id))
    )
  }

  async function applyBulk(action: 'activate' | 'deactivate') {
    setBusy(true)
    setError(null)
    const supabase = createSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    const ids = Array.from(selected)
    const { error: e } = await supabase
      .from('localities')
      .update({ active: action === 'activate', modified_by: user?.id ?? null })
      .in('id', ids)
    if (e) {
      setError('Error al actualizar las localidades. Inténtalo de nuevo.')
      setBusy(false)
      return
    }
    setSelected(new Set())
    setConfirming(null)
    setBusy(false)
    router.refresh()
  }

  const allChecked = visible.length > 0 && selected.size === visible.length
  const partialChecked = selected.size > 0 && !allChecked

  return (
    <>
      {/* Filtro por estado */}
      <div className="mb-4 inline-flex items-center gap-1 bg-white rounded-xl border border-[#EFE8D6] p-1">
        <FilterButton current={filter} value="all" onClick={changeFilter}>Todas</FilterButton>
        <FilterButton current={filter} value="active" onClick={changeFilter}>Activas</FilterButton>
        <FilterButton current={filter} value="inactive" onClick={changeFilter}>Inactivas</FilterButton>
      </div>

      {/* Tabla */}
      {visible.length === 0 ? (
        <p className="text-[#a07860] text-sm">No hay localidades para mostrar con este filtro.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EFE8D6] overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAF6EE] border-b border-[#EFE8D6]">
              <tr>
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={el => { if (el) el.indeterminate = partialChecked }}
                    onChange={toggleAll}
                    aria-label="Seleccionar todas las visibles"
                    className="accent-[#C9633E] w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold">Localidad</th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold">Provincia</th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold">Comunidad</th>
                <th className="text-left px-5 py-3 text-[#8E4226] font-semibold">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8D6]">
              {visible.map(loc => {
                const isSelected = selected.has(loc.id)
                return (
                  <tr
                    key={loc.id}
                    className={`transition-colors ${isSelected ? 'bg-[#FAF6EE]' : 'hover:bg-[#FAF6EE]'}`}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(loc.id)}
                        aria-label={`Seleccionar ${loc.name}`}
                        className="accent-[#C9633E] w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3 font-medium text-[#2C1810]">{loc.name}</td>
                    <td className="px-5 py-3 text-[#5a3f30]">{loc.province}</td>
                    <td className="px-5 py-3 text-[#5a3f30]">{loc.region}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        loc.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {loc.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/localities/${loc.id}/edit`}
                        className="text-[#C9633E] hover:text-[#8E4226] font-medium transition-colors"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Barra flotante de acciones masivas */}
      {selected.size > 0 && (
        <div
          role="region"
          aria-label="Acciones masivas"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white rounded-2xl shadow-xl border border-[#EFE8D6] px-5 py-3 flex items-center gap-3 sm:gap-4 flex-wrap justify-center max-w-[calc(100vw-2rem)]"
        >
          <span className="text-sm font-medium text-[#2C1810]">
            {selected.size} seleccionada{selected.size !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirming('activate')}
            className="text-sm font-medium px-3 py-1.5 rounded-lg bg-[#5F7355] hover:bg-[#4a5b42] text-white transition-colors disabled:opacity-60"
          >
            Activar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirming('deactivate')}
            className="text-sm font-medium px-3 py-1.5 rounded-lg bg-[#5a3f30] hover:bg-[#3d2b1f] text-white transition-colors disabled:opacity-60"
          >
            Desactivar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setSelected(new Set())}
            className="text-sm text-[#a07860] hover:text-[#5a3f30] transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Modal de confirmación */}
      {confirming && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
          onClick={() => !busy && setConfirming(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bulk-confirm-title"
            className="bg-white rounded-2xl shadow-xl border border-[#EFE8D6] max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3
              id="bulk-confirm-title"
              className="text-base font-semibold text-[#8E4226] mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {confirming === 'activate' ? '¿Activar localidades?' : '¿Desactivar localidades?'}
            </h3>
            <p className="text-sm text-[#5a3f30] mb-5">
              Vas a {confirming === 'activate' ? 'activar' : 'desactivar'}{' '}
              <strong>{selected.size}</strong>{' '}
              localidad{selected.size !== 1 ? 'es' : ''}.{' '}
              {confirming === 'activate'
                ? 'Aparecerán en el mapa público inmediatamente.'
                : 'Dejarán de aparecer en el mapa público inmediatamente.'}
            </p>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirming(null)}
                className="text-sm text-[#a07860] hover:text-[#5a3f30] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => applyBulk(confirming)}
                className={`text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-60 ${
                  confirming === 'activate'
                    ? 'bg-[#5F7355] hover:bg-[#4a5b42]'
                    : 'bg-[#5a3f30] hover:bg-[#3d2b1f]'
                }`}
              >
                {busy
                  ? 'Aplicando…'
                  : confirming === 'activate' ? 'Sí, activar' : 'Sí, desactivar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function FilterButton({
  current,
  value,
  onClick,
  children,
}: {
  current: Filter
  value: Filter
  onClick: (f: Filter) => void
  children: React.ReactNode
}) {
  const active = current === value
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      aria-pressed={active}
      className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
        active
          ? 'bg-[#C9633E] text-white'
          : 'text-[#5a3f30] hover:bg-[#FAF6EE]'
      }`}
    >
      {children}
    </button>
  )
}

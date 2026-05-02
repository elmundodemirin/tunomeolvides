'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import type { Locality } from '@/lib/types'

type Props = {
  locality?: Locality
}

const MAX_AUDIO_MB = 10
const MAX_AUDIO_BYTES = MAX_AUDIO_MB * 1024 * 1024

export function LocalityForm({ locality }: Props) {
  const router = useRouter()
  const isEdit = !!locality

  const [form, setForm] = useState({
    name: locality?.name ?? '',
    province: locality?.province ?? '',
    region: locality?.region ?? '',
    latitude: locality?.latitude?.toString() ?? '',
    longitude: locality?.longitude?.toString() ?? '',
    description_es: locality?.description_es ?? '',
    description_en: locality?.description_en ?? '',
    external_url: locality?.external_url ?? '',
    cover_image_url: locality?.cover_image_url ?? '',
    active: locality?.active ?? true,
  })

  const [audioEs, setAudioEs] = useState<File | null>(null)
  const [audioEn, setAudioEn] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    setForm(prev => ({ ...prev, [target.name]: value }))
  }

  function handleAudioChange(lang: 'es' | 'en') {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null
      if (file && file.size > MAX_AUDIO_BYTES) {
        setError(`El archivo de audio no puede superar ${MAX_AUDIO_MB} MB.`)
        e.target.value = ''
        return
      }
      setError(null)
      if (lang === 'es') setAudioEs(file)
      else setAudioEn(file)
    }
  }

  async function uploadAudio(localityId: string, file: File, lang: 'es' | 'en') {
    const supabase = createSupabaseBrowserClient()
    const path = `${localityId}/${lang}.mp3`
    const { error } = await supabase.storage
      .from('audios')
      .upload(path, file, { upsert: true, contentType: 'audio/mpeg' })
    if (error) throw new Error(`Error subiendo audio (${lang}): ${error.message}`)
    const { data } = supabase.storage.from('audios').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        external_url: form.external_url || null,
        cover_image_url: form.cover_image_url || null,
      }

      let localityId: string

      if (isEdit) {
        const res = await fetch(`/api/admin/localities/${locality.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? 'Error al guardar la localidad.')
        }
        localityId = locality.id
      } else {
        const res = await fetch('/api/admin/localities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? 'Error al crear la localidad.')
        }
        const created = await res.json()
        localityId = created.id
      }

      // Subir audios si se han seleccionado
      const audioUpdates: Record<string, string> = {}
      if (audioEs) audioUpdates.audio_url_es = await uploadAudio(localityId, audioEs, 'es')
      if (audioEn) audioUpdates.audio_url_en = await uploadAudio(localityId, audioEn, 'en')

      if (Object.keys(audioUpdates).length > 0) {
        await fetch(`/api/admin/localities/${localityId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(audioUpdates),
        })
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido.')
      setLoading(false)
    }
  }

  async function handleToggleActive() {
    if (!isEdit) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/localities/${locality.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !locality.active }),
      })
      if (!res.ok) throw new Error('Error al cambiar el estado.')
      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">

      {/* Información básica */}
      <Section title="Información básica">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre del pueblo" required>
            <input
              name="name" type="text" required value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Provincia" required>
            <input
              name="province" type="text" required value={form.province}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Comunidad autónoma" required>
            <input
              name="region" type="text" required value={form.region}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="URL externa (web turística)">
            <input
              name="external_url" type="url" value={form.external_url}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input
            name="active" type="checkbox" checked={form.active}
            onChange={handleChange}
            className="w-4 h-4 accent-[#C9633E]"
          />
          <span className="text-sm text-[#2C1810]">Localidad activa (visible en el mapa)</span>
        </label>
      </Section>

      {/* Coordenadas */}
      <Section title="Ubicación en el mapa">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitud" required>
            <input
              name="latitude" type="number" step="any" required value={form.latitude}
              onChange={handleChange}
              placeholder="40.4168"
              className={inputClass}
            />
          </Field>
          <Field label="Longitud" required>
            <input
              name="longitude" type="number" step="any" required value={form.longitude}
              onChange={handleChange}
              placeholder="-3.7038"
              className={inputClass}
            />
          </Field>
        </div>
        <p className="text-xs text-[#a07860] mt-1">
          Puedes obtener las coordenadas haciendo clic derecho en Google Maps → &quot;¿Qué hay aquí?&quot;
        </p>
      </Section>

      {/* Descripciones */}
      <Section title="Descripción">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Descripción en español" required>
            <textarea
              name="description_es" required value={form.description_es}
              onChange={handleChange}
              rows={5}
              className={inputClass}
            />
          </Field>
          <Field label="Description in English" required>
            <textarea
              name="description_en" required value={form.description_en}
              onChange={handleChange}
              rows={5}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      {/* Audios */}
      <Section title="Audios narrados">
        <div className="grid grid-cols-2 gap-6">
          <AudioField
            label="Audio en español"
            currentUrl={locality?.audio_url_es}
            onChange={handleAudioChange('es')}
          />
          <AudioField
            label="Audio in English"
            currentUrl={locality?.audio_url_en}
            onChange={handleAudioChange('en')}
          />
        </div>
        <p className="text-xs text-[#a07860] mt-1">
          Formato MP3. Máximo {MAX_AUDIO_MB} MB por archivo.
        </p>
      </Section>

      {/* URL imagen de portada */}
      <Section title="Imagen de portada (opcional)">
        <Field label="URL de la imagen">
          <input
            name="cover_image_url" type="url" value={form.cover_image_url}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
      </Section>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>
      )}

      {/* Acciones */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#C9633E] hover:bg-[#8E4226] text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear localidad'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="text-[#5a3f30] hover:text-[#8E4226] font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          Cancelar
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={loading}
            className="ml-auto text-sm text-[#a07860] hover:text-[#5a3f30] underline transition-colors disabled:opacity-60"
          >
            {locality.active ? 'Desactivar localidad' : 'Activar localidad'}
          </button>
        )}
      </div>

    </form>
  )
}

// ── Subcomponentes internos ──────────────────────────────────────────────────

const inputClass =
  'w-full border border-[#EFE8D6] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C9633E] focus:border-transparent'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EFE8D6] p-6 space-y-4">
      <h2
        className="text-base font-semibold text-[#8E4226]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, required, children }: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2C1810] mb-1">
        {label}{required && <span className="text-[#C9633E] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function AudioField({ label, currentUrl, onChange }: {
  label: string
  currentUrl?: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <Field label={label}>
      {currentUrl && (
        <audio controls src={currentUrl} className="w-full mb-2 rounded-lg" />
      )}
      <input
        type="file"
        accept="audio/mpeg,.mp3"
        onChange={onChange}
        className="w-full text-sm text-[#5a3f30] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FAF6EE] file:text-[#C9633E] hover:file:bg-[#EFE8D6] cursor-pointer"
      />
    </Field>
  )
}

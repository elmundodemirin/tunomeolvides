export type Locality = {
  id: string
  name: string
  province: string
  region: string
  latitude: number
  longitude: number
  description_es: string
  description_en: string
  audio_url_es: string | null
  audio_url_en: string | null
  external_url: string | null
  cover_image_url: string | null
  active: boolean
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  message: string
  consent_given: boolean
  consent_timestamp: string
  created_at: string
  handled: boolean
  handled_at: string | null
  handled_by: string | null
  admin_notes: string | null
  updated_at: string
}

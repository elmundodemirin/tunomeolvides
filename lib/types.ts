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

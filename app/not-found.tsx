import { NotFoundContent } from '@/components/NotFoundContent'

// Respaldo sin idioma: se usa cuando la dirección ni siquiera tiene un idioma
// válido (p. ej. /foto.png, que antes se tomaba por un idioma «foto.png» y
// devolvía la portada con estado 200). Sin cabecera ni pie, en español.
export default function RootNotFound() {
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-papel)' }}>
      <NotFoundContent
        title="Esta página se ha perdido por el camino"
        body="Puede que la dirección esté mal escrita o que la página ya no exista. Pero el mapa sigue aquí, con las voces de los pueblos esperando a ser escuchadas."
        cta="Volver al inicio"
        homeHref="/"
      />
    </main>
  )
}

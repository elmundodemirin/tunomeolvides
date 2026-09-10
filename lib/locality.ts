// FR no tiene contenido propio en BD: cae al inglés tanto para descripción
// como para audio. ES sigue siendo la fuente principal y EN su par.
export function pickLocalized<T>(locale: string, es: T, en: T): T {
  if (locale === 'en' || locale === 'fr') return en
  return es
}

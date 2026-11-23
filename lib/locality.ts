// ES es la fuente principal y EN su par.
export function pickLocalized<T>(locale: string, es: T, en: T): T {
  if (locale === 'en') return en
  return es
}

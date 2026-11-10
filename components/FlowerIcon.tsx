type Props = {
  size?: number
  className?: string
}

// La flor del no-me-olvides: 5 pétalos en torno a un centro claro.
// Usada en la cabecera pública y en el panel de administración.
// Color azul de la propia flor (--color-flower, fuera de la paleta de 3
// colores a propósito — es la firma del símbolo, no del texto/UI; terracota
// sigue reservado para botones, enlaces y marcadores del mapa).
export function FlowerIcon({ size = 26, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="14"
          cy="14"
          rx="4"
          ry="8"
          fill="var(--color-flower)"
          opacity="0.9"
          transform={`rotate(${deg} 14 14) translate(0 -5)`}
        />
      ))}
      <circle cx="14" cy="14" r="4" fill="var(--color-papel)" />
      <circle cx="14" cy="14" r="2.5" fill="var(--color-flower)" />
    </svg>
  )
}

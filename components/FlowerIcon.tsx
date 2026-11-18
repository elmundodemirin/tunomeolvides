type Props = {
  size?: number
  className?: string
}

// La flor del no-me-olvides: 5 pétalos azules en torno al sol de rayos
// blancos (el centro real de la flor) y un botón amarillo — construida
// siguiendo la "Guía del símbolo" de la promotora (2026-11-18). Usada en
// la cabecera pública, el panel de administración y el favicon.
// Azul de los pétalos (--color-flower) y amarillo del botón
// (--color-flower-button) fuera de la paleta de 3 colores a propósito —
// son la firma del símbolo, no del texto/UI; terracota sigue reservado
// para botones, enlaces y marcadores del mapa.
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
      <g transform="translate(14 14)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <polygon
            key={deg}
            points="-0.9,2.3 0.9,2.3 0,5"
            fill="var(--color-papel)"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="2.6" fill="var(--color-papel)" />
        <circle cx="0" cy="0" r="1.6" fill="var(--color-flower-button)" />
      </g>
    </svg>
  )
}

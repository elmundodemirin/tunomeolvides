type Props = {
  size?: number
  className?: string
}

// La flor del no-me-olvides: 5 pétalos azules en torno a un centro crema.
// Usada en la cabecera pública y en el panel de administración.
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
          fill="#6B8CB8"
          opacity="0.9"
          transform={`rotate(${deg} 14 14) translate(0 -5)`}
        />
      ))}
      <circle cx="14" cy="14" r="4" fill="#FAF6EE" />
      <circle cx="14" cy="14" r="2.5" fill="#6B8CB8" />
    </svg>
  )
}

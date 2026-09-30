type Props = {
  valor: number;
  tamano?: "sm" | "md" | "lg";
  className?: string;
};

const TAMANOS = { sm: "size-3.5", md: "size-4.5", lg: "size-6" };

/** Muestra de 0 a 5 estrellas, con relleno parcial para valores decimales. */
export default function Estrellas({ valor, tamano = "md", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${valor.toFixed(1)} de 5 estrellas`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const relleno = Math.max(0, Math.min(1, valor - i)) * 100;
        return (
          <span key={i} className={`relative ${TAMANOS[tamano]}`} aria-hidden>
            <Estrella className="absolute inset-0 text-arena-200" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${relleno}%` }}>
              <Estrella className={`${TAMANOS[tamano]} text-ocaso-500`} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function Estrella({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
    </svg>
  );
}

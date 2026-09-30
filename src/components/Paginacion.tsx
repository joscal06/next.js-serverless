import Link from "next/link";

type Props = {
  pagina: number;
  totalPaginas: number;
  /** Parámetros actuales de búsqueda (se conservan al cambiar de página). */
  parametros: Record<string, string | undefined>;
};

function enlace(parametros: Props["parametros"], pagina: number) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(parametros)) if (v) sp.set(k, v);
  if (pagina > 1) sp.set("pagina", String(pagina));
  else sp.delete("pagina");
  const qs = sp.toString();
  return qs ? `/destinos?${qs}` : "/destinos";
}

export default function Paginacion({ pagina, totalPaginas, parametros }: Props) {
  if (totalPaginas <= 1) return null;

  const base = "grid size-10 place-items-center rounded-full text-sm font-semibold transition";

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginación">
      {pagina > 1 ? (
        <Link href={enlace(parametros, pagina - 1)} className={`${base} bg-white shadow-sm hover:bg-arena-100`} aria-label="Página anterior">
          ←
        </Link>
      ) : (
        <span className={`${base} text-arena-200`} aria-hidden>←</span>
      )}

      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={enlace(parametros, n)}
          aria-current={n === pagina ? "page" : undefined}
          className={`${base} ${n === pagina ? "bg-mar-600 text-white" : "bg-white shadow-sm hover:bg-arena-100"}`}
        >
          {n}
        </Link>
      ))}

      {pagina < totalPaginas ? (
        <Link href={enlace(parametros, pagina + 1)} className={`${base} bg-white shadow-sm hover:bg-arena-100`} aria-label="Página siguiente">
          →
        </Link>
      ) : (
        <span className={`${base} text-arena-200`} aria-hidden>→</span>
      )}
    </nav>
  );
}

export function EsqueletoTarjeta() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-tarjeta" aria-hidden>
      <div className="esqueleto aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <div className="esqueleto h-3 w-1/3" />
        <div className="esqueleto h-5 w-2/3" />
        <div className="esqueleto h-3 w-full" />
        <div className="esqueleto h-3 w-5/6" />
        <div className="esqueleto mt-4 h-3 w-1/4" />
      </div>
    </div>
  );
}

export function EsqueletoGrilla({ cantidad = 6 }: { cantidad?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Cargando destinos">
      {Array.from({ length: cantidad }, (_, i) => (
        <EsqueletoTarjeta key={i} />
      ))}
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

export function EsqueletoEncabezado() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="esqueleto h-4 w-40" />
      <div className="esqueleto h-10 w-2/3 max-w-lg" />
      <div className="esqueleto h-4 w-full max-w-xl" />
    </div>
  );
}

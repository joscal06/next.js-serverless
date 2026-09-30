export default function CargandoDestino() {
  return (
    <div role="status" aria-label="Cargando destino">
      <div className="esqueleto h-[60vh] rounded-none" />
      <div className="contenedor mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="esqueleto h-7 w-56" />
          <div className="esqueleto h-4 w-full" />
          <div className="esqueleto h-4 w-11/12" />
          <div className="esqueleto h-4 w-4/5" />
          <div className="esqueleto h-4 w-full" />
          <div className="esqueleto h-4 w-2/3" />
        </div>
        <div className="esqueleto h-80 rounded-3xl" />
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

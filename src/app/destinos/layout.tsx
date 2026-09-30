import Link from "next/link";

/**
 * Layout anidado de /destinos y /destinos/[slug].
 * Se mantiene montado al navegar entre el listado y el detalle.
 */
export default function LayoutDestinos({ children }: LayoutProps<"/destinos">) {
  return (
    <>
      {children}

      <aside className="contenedor pt-20" aria-label="Consejos de viaje">
        <div className="grid gap-6 rounded-3xl border border-arena-200 bg-white p-6 sm:grid-cols-3 sm:p-8">
          <div className="sm:col-span-1">
            <p className="font-display text-xl font-semibold">Consejos para tu viaje</p>
            <p className="mt-2 text-sm text-tinta-suave">
              Información práctica para disfrutar El Salvador con tranquilidad.
            </p>
          </div>
          <ul className="grid gap-4 text-sm sm:col-span-2 sm:grid-cols-2">
            <li className="flex gap-3">
              <span aria-hidden className="text-xl">💵</span>
              <span>La moneda oficial es el <strong>dólar estadounidense</strong>; lleva efectivo para pueblos y playas.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="text-xl">☀️</span>
              <span>La <strong>estación seca</strong> va de noviembre a abril: ideal para volcanes y senderos.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="text-xl">🥾</span>
              <span>En volcanes y parques nacionales el ingreso suele hacerse <strong>con guía</strong> y en horarios fijos.</span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="text-xl">🧭</span>
              <span>
                ¿No sabes por dónde empezar? Explora por{" "}
                <Link href="/categorias" className="font-semibold text-mar-700 hover:underline">categorías</Link>.
              </span>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

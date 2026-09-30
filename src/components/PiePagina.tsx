import Link from "next/link";

export default function PiePagina() {
  return (
    <footer className="mt-24 bg-mar-900 text-mar-100">
      <div className="contenedor grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl font-semibold text-white">
            Destinos <span className="text-ocaso-400">SV</span>
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mar-100/80">
            Una guía para descubrir El Salvador: el país más pequeño de Centroamérica, con más de
            veinte volcanes, olas de clase mundial y una historia de miles de años.
          </p>
        </div>

        <nav aria-label="Explorar">
          <p className="text-sm font-semibold tracking-wide text-white uppercase">Explorar</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/destinos">Todos los destinos</Link></li>
            <li><Link className="hover:text-white" href="/categorias">Categorías</Link></li>
            <li><Link className="hover:text-white" href="/destinos?orden=calificacion">Mejor valorados</Link></li>
            <li><Link className="hover:text-white" href="/destinos?orden=precio">Entrada gratuita</Link></li>
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold tracking-wide text-white uppercase">Proyecto</p>
          <ul className="mt-4 space-y-2 text-sm text-mar-100/80">
            <li>Next.js 16 · App Router</li>
            <li>Supabase · PostgreSQL + RLS</li>
            <li>Desplegado en Vercel</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="contenedor py-5 text-xs text-mar-100/60">
          © {new Date().getFullYear()} Destinos SV · Fotografías de Wikimedia Commons bajo sus respectivas
          licencias (créditos en cada destino). Precios de entrada referenciales.
        </p>
      </div>
    </footer>
  );
}

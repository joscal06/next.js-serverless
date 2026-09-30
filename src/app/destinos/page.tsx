import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import Paginacion from "@/components/Paginacion";
import TarjetaDestino from "@/components/TarjetaDestino";
import { getCategorias, getDestinos } from "@/lib/data";
import type { OrdenDestinos } from "@/lib/types";
import { pluralizar } from "@/lib/formato";

export const metadata: Metadata = {
  title: "Destinos",
  description: "Busca y filtra playas, volcanes, lagos, pueblos y sitios arqueológicos de El Salvador.",
};

const ORDENES: { valor: OrdenDestinos; texto: string }[] = [
  { valor: "nombre", texto: "Nombre (A-Z)" },
  { valor: "calificacion", texto: "Mejor valorados" },
  { valor: "precio", texto: "Precio de entrada" },
  { valor: "recientes", texto: "Agregados recientemente" },
];

/** Lee un parámetro de búsqueda como texto simple (ignora valores repetidos). */
function texto(valor: string | string[] | undefined): string | undefined {
  const v = Array.isArray(valor) ? valor[0] : valor;
  return v?.trim() ? v.trim().slice(0, 80) : undefined;
}

export default async function PaginaDestinos({ searchParams }: PageProps<"/destinos">) {
  const sp = await searchParams;
  const q = texto(sp.q);
  const categoria = texto(sp.categoria);
  const ordenTexto = texto(sp.orden);
  const orden = ORDENES.some((o) => o.valor === ordenTexto) ? (ordenTexto as OrdenDestinos) : "nombre";
  const pagina = Number.parseInt(texto(sp.pagina) ?? "1", 10) || 1;

  const [categorias, resultado] = await Promise.all([
    getCategorias(),
    getDestinos({ q, categoria, orden, pagina }),
  ]);

  const categoriaActual = categorias.find((c) => c.slug === categoria);
  const hayFiltros = Boolean(q || categoria || orden !== "nombre");

  // Enlaces de filtro rápido: conservan búsqueda y orden, reinician la página.
  const hrefCategoria = (slug?: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (slug) p.set("categoria", slug);
    if (orden !== "nombre") p.set("orden", orden);
    const qs = p.toString();
    return qs ? `/destinos?${qs}` : "/destinos";
  };

  return (
    <div className="contenedor pt-12">
      <header>
        <p className="text-sm font-semibold tracking-wider text-mar-600 uppercase">Explorar</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {categoriaActual ? `${categoriaActual.icono} ${categoriaActual.nombre}` : "Todos los destinos"}
        </h1>
        <p className="mt-3 max-w-2xl text-tinta-suave">
          {categoriaActual?.descripcion ??
            "Filtra por categoría, busca por nombre o departamento y ordena según lo que más te importe."}
        </p>
      </header>

      {/* Filtros: <Form> de Next actualiza los searchParams con navegación del lado del cliente */}
      <Form
        action="/destinos"
        className="mt-8 grid gap-3 rounded-3xl bg-white p-4 shadow-tarjeta sm:grid-cols-[1fr_auto_auto] sm:items-center"
        role="search"
      >
        {categoria && <input type="hidden" name="categoria" value={categoria} />}
        <label className="sr-only" htmlFor="q">Buscar</label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, departamento o descripción…"
          className="campo"
        />
        <label className="sr-only" htmlFor="orden">Ordenar por</label>
        <select id="orden" name="orden" defaultValue={orden} className="campo sm:w-56">
          {ORDENES.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
        <button type="submit" className="boton-primario h-11">
          Aplicar
        </button>
      </Form>

      <nav className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2" aria-label="Filtrar por categoría">
        <Link
          href={hrefCategoria()}
          aria-current={!categoria ? "page" : undefined}
          className={`etiqueta shrink-0 px-4 py-2 text-sm ${
            !categoria ? "bg-tinta text-white" : "bg-white text-tinta ring-1 ring-arena-200 hover:ring-mar-500"
          }`}
        >
          Todas
        </Link>
        {categorias.map((c) => (
          <Link
            key={c.id}
            href={hrefCategoria(c.slug)}
            aria-current={categoria === c.slug ? "page" : undefined}
            className={`etiqueta shrink-0 px-4 py-2 text-sm ${
              categoria === c.slug
                ? "bg-tinta text-white"
                : "bg-white text-tinta ring-1 ring-arena-200 hover:ring-mar-500"
            }`}
          >
            <span aria-hidden>{c.icono}</span> {c.nombre}
          </Link>
        ))}
      </nav>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm text-tinta-suave" aria-live="polite">
        <p>
          {pluralizar(resultado.total, "destino encontrado", "destinos encontrados")}
          {q && (
            <>
              {" "}para «<span className="font-semibold text-tinta">{q}</span>»
            </>
          )}
        </p>
        {hayFiltros && (
          <Link href="/destinos" className="font-semibold text-mar-700 hover:underline">
            Limpiar filtros
          </Link>
        )}
      </div>

      {resultado.destinos.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resultado.destinos.map((d, i) => (
            <TarjetaDestino key={d.id} destino={d} prioridad={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-arena-200 bg-white px-6 py-16 text-center">
          <p className="text-4xl" aria-hidden>🧭</p>
          <p className="mt-3 font-display text-xl font-semibold">No encontramos destinos</p>
          <p className="mt-1 text-sm text-tinta-suave">Prueba con otra palabra o quita algún filtro.</p>
          <Link href="/destinos" className="boton-secundario mt-6">
            Ver todos los destinos
          </Link>
        </div>
      )}

      <Paginacion
        pagina={resultado.pagina}
        totalPaginas={resultado.totalPaginas}
        parametros={{ q, categoria, orden: orden !== "nombre" ? orden : undefined }}
      />
    </div>
  );
}

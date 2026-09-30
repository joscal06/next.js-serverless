import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import TarjetaCategoria from "@/components/TarjetaCategoria";
import TarjetaDestino from "@/components/TarjetaDestino";
import Estrellas from "@/components/Estrellas";
import {
  getCategorias,
  getDestinosDestacados,
  getEstadisticas,
  getResenasRecientes,
} from "@/lib/data";

// ISR: la portada se regenera como máximo cada 5 minutos
// (y al instante cuando alguien publica una reseña, vía revalidatePath).
export const revalidate = 300;

const RAZONES = [
  {
    icono: "🚗",
    titulo: "Todo queda cerca",
    texto: "En menos de tres horas cruzas el país de costa a montaña: surf por la mañana y volcán por la tarde.",
  },
  {
    icono: "🏄",
    titulo: "Olas de clase mundial",
    texto: "Surf City reúne algunos de los mejores rompientes de derecha de Centroamérica durante todo el año.",
  },
  {
    icono: "🫓",
    titulo: "La tierra de la pupusa",
    texto: "Festivales gastronómicos, café de altura premiado y mariscos frescos en cada playa.",
  },
  {
    icono: "🏛️",
    titulo: "Historia viva",
    texto: "Sitios mayas, pueblos coloniales y una aldea precolombina que es Patrimonio de la Humanidad.",
  },
];

export default async function Inicio() {
  const [categorias, destacados, estadisticas, resenas] = await Promise.all([
    getCategorias(),
    getDestinosDestacados(6),
    getEstadisticas(),
    getResenasRecientes(3),
  ]);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/img/destinos/lago-de-coatepeque.jpg"
          alt="Vista aérea del Lago de Coatepeque"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-mar-900/70 via-mar-900/40 to-mar-900/85" />

        <div className="contenedor flex min-h-[calc(88vh-4rem)] flex-col justify-center py-20 text-white">
          <p className="etiqueta w-fit bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">
            🇸🇻 Guía de viaje · El Salvador
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Volcanes, olas y pueblos que <span className="text-ocaso-400 italic">enamoran</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Descubre los mejores destinos del país más pequeño de Centroamérica, con información práctica y
            reseñas de otros viajeros.
          </p>

          <Form action="/destinos" className="mt-8 flex w-full max-w-xl flex-col gap-2 sm:flex-row" role="search">
            <label htmlFor="busqueda-inicio" className="sr-only">
              Buscar destinos
            </label>
            <input
              id="busqueda-inicio"
              name="q"
              placeholder="Busca un lugar o departamento…"
              className="campo h-12 flex-1 rounded-full border-0 px-5 text-base shadow-lg"
            />
            <button type="submit" className="boton-acento h-12 px-7 text-base shadow-lg">
              Buscar
            </button>
          </Form>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/20 pt-6">
            {[
              { valor: estadisticas.destinos, texto: "destinos" },
              { valor: estadisticas.categorias, texto: "categorías" },
              { valor: estadisticas.resenas, texto: "reseñas" },
            ].map((e) => (
              <div key={e.texto}>
                <dt className="text-sm text-white/70">{e.texto}</dt>
                <dd className="font-display text-3xl font-semibold sm:text-4xl">{e.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Categorías ---------- */}
      <section className="contenedor pt-20" aria-labelledby="titulo-categorias">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wider text-mar-600 uppercase">Explora por tipo</p>
            <h2 id="titulo-categorias" className="titulo-seccion mt-2">
              ¿Qué te gustaría vivir?
            </h2>
          </div>
          <Link href="/categorias" className="text-sm font-semibold text-mar-700 hover:underline">
            Ver todas las categorías →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categorias.map((c) => (
            <TarjetaCategoria key={c.id} categoria={c} />
          ))}
        </div>
      </section>

      {/* ---------- Destacados ---------- */}
      <section className="contenedor pt-24" aria-labelledby="titulo-destacados">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wider text-mar-600 uppercase">Imperdibles</p>
            <h2 id="titulo-destacados" className="titulo-seccion mt-2">
              Destinos destacados
            </h2>
          </div>
          <Link href="/destinos" className="boton-secundario">
            Ver los {estadisticas.destinos} destinos
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destacados.map((d) => (
            <TarjetaDestino key={d.id} destino={d} />
          ))}
        </div>
      </section>

      {/* ---------- Por qué ---------- */}
      <section className="mt-24 bg-arena-100 py-20" aria-labelledby="titulo-razones">
        <div className="contenedor">
          <h2 id="titulo-razones" className="titulo-seccion max-w-2xl">
            Un país pequeño con <span className="text-mar-600">muchísimo</span> por descubrir
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {RAZONES.map((r) => (
              <div key={r.titulo} className="rounded-3xl bg-white p-6 shadow-tarjeta">
                <span aria-hidden className="grid size-12 place-items-center rounded-2xl bg-mar-50 text-2xl">
                  {r.icono}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{r.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-tinta-suave">{r.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Reseñas ---------- */}
      {resenas.length > 0 && (
        <section className="contenedor pt-24" aria-labelledby="titulo-resenas">
          <p className="text-sm font-semibold tracking-wider text-mar-600 uppercase">Lo que dicen los viajeros</p>
          <h2 id="titulo-resenas" className="titulo-seccion mt-2">
            Reseñas recientes
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {resenas.map((r) => (
              <figure key={r.id} className="flex flex-col rounded-3xl border border-arena-200 bg-white p-6">
                <Estrellas valor={r.calificacion} tamano="sm" />
                <blockquote className="mt-3 flex-1 text-tinta">“{r.comentario}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{r.autor}</span>
                  <span className="text-tinta-suave"> sobre </span>
                  <Link href={`/destinos/${r.destino.slug}`} className="font-medium text-mar-700 hover:underline">
                    {r.destino.nombre}
                  </Link>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <section className="contenedor pt-24">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-mar-600 px-6 py-14 text-center text-white sm:px-12">
          <div
            aria-hidden
            className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-ocaso-500/40 blur-3xl"
          />
          <div aria-hidden className="absolute -bottom-24 -left-24 -z-10 size-72 rounded-full bg-mar-900/60 blur-3xl" />
          <h2 className="font-display text-3xl font-semibold text-balance sm:text-4xl">
            ¿Ya visitaste alguno de estos lugares?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Comparte tu experiencia y ayuda a otros viajeros a planificar su próxima aventura.
          </p>
          <Link href="/destinos" className="boton mt-8 bg-white text-mar-700 hover:bg-arena-100">
            Escribir una reseña
          </Link>
        </div>
      </section>
    </>
  );
}

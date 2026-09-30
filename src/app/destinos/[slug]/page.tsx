import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Estrellas from "@/components/Estrellas";
import TarjetaDestino from "@/components/TarjetaDestino";
import { EsqueletoGrilla } from "@/components/Esqueletos";
import { getDestino, getDestinosPorCategoria, getResenas, getSlugsDestinos } from "@/lib/data";
import { formatoCalificacion, formatoFecha, formatoPrecio, pluralizar } from "@/lib/formato";
import FormularioResena from "./FormularioResena";
import ItemResena from "./ItemResena";

// Las páginas se generan en el build (SSG) y se regeneran cada 5 minutos (ISR).
// Los destinos agregados después del build se renderizan bajo demanda (dynamicParams = true).
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getSlugsDestinos();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/destinos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const destino = await getDestino(slug);
  if (!destino) return { title: "Destino no encontrado" };

  return {
    title: destino.nombre,
    description: destino.resumen,
    openGraph: {
      title: `${destino.nombre} · Destinos SV`,
      description: destino.resumen,
      images: destino.imagen_url ? [destino.imagen_url] : undefined,
    },
  };
}

export default async function PaginaDestino({ params }: PageProps<"/destinos/[slug]">) {
  const { slug } = await params;
  const destino = await getDestino(slug);
  if (!destino) notFound();

  const resenas = await getResenas(destino.id);
  const total = resenas.length;
  const promedio = total ? resenas.reduce((s, r) => s + r.calificacion, 0) / total : 0;
  const distribucion = [5, 4, 3, 2, 1].map((n) => ({
    estrellas: n,
    cantidad: resenas.filter((r) => r.calificacion === n).length,
  }));
  const parrafos = destino.descripcion.split(/\n\s*\n/);
  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${destino.nombre}, ${destino.departamento}, El Salvador`,
  )}`;

  return (
    <article>
      {/* ---------- Portada ---------- */}
      <header className="relative isolate overflow-hidden">
        {destino.imagen_url && (
          <Image
            src={destino.imagen_url}
            alt={destino.nombre}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-tinta/90 via-tinta/40 to-tinta/10" />

        <div className="contenedor flex min-h-[60vh] flex-col justify-end pt-24 pb-10 text-white">
          <nav aria-label="Ruta de navegación" className="text-sm text-white/80">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-white">Inicio</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/destinos" className="hover:text-white">Destinos</Link></li>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/categorias/${destino.categoria.slug}`} className="hover:text-white">
                  {destino.categoria.nombre}
                </Link>
              </li>
            </ol>
          </nav>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
            {destino.nombre}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-white/85">{destino.resumen}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="etiqueta bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">📍 {destino.departamento}</span>
            <span className="etiqueta bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">
              {destino.categoria.icono} {destino.categoria.nombre}
            </span>
            {total > 0 && (
              <span className="etiqueta bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">
                <Estrellas valor={promedio} tamano="sm" /> {formatoCalificacion(promedio)} ({total})
              </span>
            )}
          </div>
        </div>
      </header>

      {destino.imagen_credito && (
        <p className="contenedor mt-2 text-right text-xs text-tinta-suave">Foto: {destino.imagen_credito}</p>
      )}

      {/* ---------- Contenido ---------- */}
      <div className="contenedor mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <section aria-labelledby="titulo-descripcion">
            <h2 id="titulo-descripcion" className="font-display text-2xl font-semibold">Sobre este destino</h2>
            <div className="mt-4 space-y-4 text-lg leading-relaxed text-tinta/90">
              {parrafos.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {destino.actividades.length > 0 && (
              <>
                <h3 className="mt-8 font-display text-xl font-semibold">Qué hacer</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {destino.actividades.map((a) => (
                    <li key={a} className="etiqueta bg-mar-50 px-4 py-2 text-sm text-mar-700">
                      {a}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* ---------- Reseñas ---------- */}
          <section id="resenas" className="mt-14 scroll-mt-24" aria-labelledby="titulo-resenas">
            <h2 id="titulo-resenas" className="font-display text-2xl font-semibold">
              Reseñas de viajeros
            </h2>

            <div className="mt-5 grid gap-6 rounded-3xl bg-white p-6 shadow-tarjeta sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="text-center sm:border-r sm:border-arena-200 sm:pr-8">
                <p className="font-display text-5xl font-semibold">{total ? formatoCalificacion(promedio) : "—"}</p>
                <Estrellas valor={promedio} className="mt-1" />
                <p className="mt-1 text-sm text-tinta-suave">{pluralizar(total, "reseña", "reseñas")}</p>
              </div>
              <ul className="space-y-1.5" aria-label="Distribución de calificaciones">
                {distribucion.map((d) => (
                  <li key={d.estrellas} className="flex items-center gap-3 text-sm">
                    <span className="w-14 shrink-0 text-tinta-suave">{d.estrellas} ★</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-arena-100">
                      <span
                        className="block h-full rounded-full bg-ocaso-500"
                        style={{ width: `${total ? (d.cantidad / total) * 100 : 0}%` }}
                      />
                    </span>
                    <span className="w-6 text-right tabular-nums text-tinta-suave">{d.cantidad}</span>
                  </li>
                ))}
              </ul>
            </div>

            {total > 0 ? (
              <ul className="mt-6 space-y-4">
                {resenas.map((r) => (
                  <ItemResena key={r.id} resena={r} slug={destino.slug} fecha={formatoFecha(r.created_at)} />
                ))}
              </ul>
            ) : (
              <p className="mt-6 rounded-2xl border border-dashed border-arena-200 p-6 text-center text-tinta-suave">
                Aún no hay reseñas. ¡Sé la primera persona en contar su experiencia!
              </p>
            )}

            <div className="mt-8 rounded-3xl border border-arena-200 bg-arena-100/60 p-6">
              <h3 className="font-display text-xl font-semibold">Escribe tu reseña</h3>
              <p className="mt-1 mb-5 text-sm text-tinta-suave">
                Podrás editarla o eliminarla más tarde desde este mismo navegador.
              </p>
              <FormularioResena destinoId={destino.id} slug={destino.slug} />
            </div>
          </section>
        </div>

        {/* ---------- Ficha lateral ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-white p-6 shadow-tarjeta">
            <p className="text-sm text-tinta-suave">Entrada</p>
            <p className="font-display text-3xl font-semibold text-mar-700">{formatoPrecio(destino.precio_entrada)}</p>
            {Number(destino.precio_entrada) > 0 && (
              <p className="text-xs text-tinta-suave">Precio referencial para visitantes extranjeros</p>
            )}

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex gap-3">
                <dt aria-hidden className="text-lg">📍</dt>
                <dd>
                  <span className="block text-tinta-suave">Departamento</span>
                  <span className="font-medium">{destino.departamento}</span>
                </dd>
              </div>
              {destino.mejor_epoca && (
                <div className="flex gap-3">
                  <dt aria-hidden className="text-lg">🗓️</dt>
                  <dd>
                    <span className="block text-tinta-suave">Mejor época</span>
                    <span className="font-medium">{destino.mejor_epoca}</span>
                  </dd>
                </div>
              )}
              {destino.duracion && (
                <div className="flex gap-3">
                  <dt aria-hidden className="text-lg">⏱️</dt>
                  <dd>
                    <span className="block text-tinta-suave">Tiempo sugerido</span>
                    <span className="font-medium">{destino.duracion}</span>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-6 grid gap-2">
              <a href={mapa} target="_blank" rel="noopener noreferrer" className="boton-primario">
                Cómo llegar ↗
              </a>
              <a href="#resenas" className="boton-secundario">
                Ver reseñas
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* ---------- Relacionados (streaming con Suspense) ---------- */}
      <section className="contenedor mt-20" aria-labelledby="titulo-relacionados">
        <h2 id="titulo-relacionados" className="titulo-seccion">
          Más {destino.categoria.nombre.toLowerCase()}
        </h2>
        <div className="mt-8">
          <Suspense fallback={<EsqueletoGrilla cantidad={3} />}>
            <Relacionados categoria={destino.categoria.slug} actual={destino.slug} />
          </Suspense>
        </div>
      </section>
    </article>
  );
}

async function Relacionados({ categoria, actual }: { categoria: string; actual: string }) {
  const destinos = (await getDestinosPorCategoria(categoria, actual)).slice(0, 3);
  if (destinos.length === 0) {
    return (
      <p className="text-tinta-suave">
        No hay otros destinos en esta categoría todavía.{" "}
        <Link href="/destinos" className="font-semibold text-mar-700 hover:underline">Ver todos</Link>
      </p>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {destinos.map((d) => (
        <TarjetaDestino key={d.id} destino={d} />
      ))}
    </div>
  );
}

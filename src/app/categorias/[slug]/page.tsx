import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TarjetaDestino from "@/components/TarjetaDestino";
import { getCategoria, getDestinosPorCategoria, getSlugsCategorias } from "@/lib/data";
import { pluralizar } from "@/lib/formato";

export const revalidate = 300;
// Solo existen las categorías generadas en el build; cualquier otro slug devuelve 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getSlugsCategorias();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/categorias/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await getCategoria(slug);
  if (!categoria) return { title: "Categoría no encontrada" };
  return {
    title: categoria.nombre,
    description: categoria.descripcion,
    openGraph: { images: categoria.imagen_url ? [categoria.imagen_url] : undefined },
  };
}

export default async function PaginaCategoria({ params }: PageProps<"/categorias/[slug]">) {
  const { slug } = await params;
  const [categoria, destinos] = await Promise.all([getCategoria(slug), getDestinosPorCategoria(slug)]);
  if (!categoria) notFound();

  return (
    <>
      <header className="relative isolate overflow-hidden">
        {categoria.imagen_url && (
          <Image src={categoria.imagen_url} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        )}
        <div
          className="absolute inset-0 -z-10"
          style={{ background: `linear-gradient(100deg, ${categoria.color}f2 0%, ${categoria.color}b3 45%, transparent 100%)` }}
        />
        <div className="contenedor py-20 text-white sm:py-28">
          <p className="text-5xl" aria-hidden>{categoria.icono}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">{categoria.nombre}</h1>
          <p className="mt-3 max-w-xl text-lg text-white/90">{categoria.descripcion}</p>
          <p className="etiqueta mt-5 bg-white/20 text-white ring-1 ring-white/30 backdrop-blur">
            {pluralizar(destinos.length, "destino", "destinos")}
          </p>
        </div>
      </header>

      <section className="contenedor mt-12" aria-label={`Destinos de ${categoria.nombre}`}>
        {destinos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinos.map((d, i) => (
              <TarjetaDestino key={d.id} destino={d} prioridad={i < 3} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl border border-dashed border-arena-200 bg-white p-10 text-center text-tinta-suave">
            Todavía no hay destinos en esta categoría.
          </p>
        )}

        <div className="mt-10 text-center">
          <Link href={`/destinos?categoria=${categoria.slug}&orden=calificacion`} className="boton-secundario">
            Buscar y ordenar {categoria.nombre.toLowerCase()} →
          </Link>
        </div>
      </section>
    </>
  );
}

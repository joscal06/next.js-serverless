import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategorias, getConteoPorCategoria } from "@/lib/data";
import { pluralizar } from "@/lib/formato";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Categorías",
  description: "Explora El Salvador por tipo de experiencia: playas, volcanes, lagos, pueblos, arqueología y naturaleza.",
};

export default async function PaginaCategorias() {
  const [categorias, conteo] = await Promise.all([getCategorias(), getConteoPorCategoria()]);

  return (
    <div className="contenedor pt-12">
      <header>
        <p className="text-sm font-semibold tracking-wider text-mar-600 uppercase">Categorías</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Elige tu tipo de aventura
        </h1>
        <p className="mt-3 max-w-2xl text-tinta-suave">
          Desde el surf en la costa hasta el bosque nuboso de la montaña: cada categoría agrupa destinos con
          experiencias similares.
        </p>
      </header>

      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {categorias.map((c, i) => (
          <li key={c.id}>
            <Link
              href={`/categorias/${c.slug}`}
              className="group flex h-full overflow-hidden rounded-3xl bg-white shadow-tarjeta transition hover:-translate-y-1 hover:shadow-tarjeta-hover"
            >
              <div className="relative w-2/5 shrink-0 overflow-hidden">
                {c.imagen_url && (
                  <Image
                    src={c.imagen_url}
                    alt=""
                    fill
                    priority={i < 2}
                    sizes="(min-width: 768px) 230px, 40vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-col p-6">
                <span
                  aria-hidden
                  className="grid size-11 place-items-center rounded-2xl text-2xl"
                  style={{ backgroundColor: `${c.color}1a` }}
                >
                  {c.icono}
                </span>
                <h2 className="mt-3 font-display text-2xl font-semibold">{c.nombre}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-tinta-suave">{c.descripcion}</p>
                <p className="mt-4 text-sm font-semibold" style={{ color: c.color }}>
                  {pluralizar(conteo[c.slug] ?? 0, "destino", "destinos")} →
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { Categoria } from "@/lib/types";

export default function TarjetaCategoria({ categoria }: { categoria: Categoria }) {
  return (
    <Link
      href={`/categorias/${categoria.slug}`}
      className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl p-5 text-white shadow-tarjeta transition hover:-translate-y-1 hover:shadow-tarjeta-hover sm:aspect-[3/4]"
    >
      {categoria.imagen_url && (
        <Image
          src={categoria.imagen_url}
          alt=""
          fill
          sizes="(min-width: 1024px) 190px, (min-width: 640px) 33vw, 50vw"
          className="-z-20 object-cover transition duration-500 group-hover:scale-110"
        />
      )}
      <div
        className="absolute inset-0 -z-10 opacity-90 transition group-hover:opacity-100"
        style={{
          background: `linear-gradient(to top, ${categoria.color} 0%, ${categoria.color}cc 25%, transparent 70%)`,
        }}
      />
      <span aria-hidden className="text-3xl drop-shadow">
        {categoria.icono}
      </span>
      <span className="mt-1 font-display text-lg leading-tight font-semibold drop-shadow sm:text-xl">
        {categoria.nombre}
      </span>
    </Link>
  );
}

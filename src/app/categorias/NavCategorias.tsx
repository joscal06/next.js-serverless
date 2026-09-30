"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type { Categoria } from "@/lib/types";

type Props = { categorias: Pick<Categoria, "slug" | "nombre" | "icono">[] };

export default function NavCategorias({ categorias }: Props) {
  // Segmento hijo activo dentro de /categorias (el [slug] actual, o null en el índice).
  const activo = useSelectedLayoutSegment();

  const clase = (seleccionado: boolean) =>
    `etiqueta shrink-0 px-4 py-2 text-sm transition ${
      seleccionado ? "bg-tinta text-white" : "bg-white text-tinta ring-1 ring-arena-200 hover:ring-mar-500"
    }`;

  return (
    <nav className="contenedor flex gap-2 overflow-x-auto py-3" aria-label="Categorías">
      <Link href="/categorias" className={clase(activo === null)} aria-current={activo === null ? "page" : undefined}>
        Todas
      </Link>
      {categorias.map((c) => (
        <Link
          key={c.slug}
          href={`/categorias/${c.slug}`}
          className={clase(activo === c.slug)}
          aria-current={activo === c.slug ? "page" : undefined}
        >
          <span aria-hidden>{c.icono}</span> {c.nombre}
        </Link>
      ))}
    </nav>
  );
}

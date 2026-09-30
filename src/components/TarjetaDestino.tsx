import Image from "next/image";
import Link from "next/link";
import type { DestinoResumen } from "@/lib/types";
import { formatoCalificacion, formatoPrecio, pluralizar } from "@/lib/formato";
import { Estrella } from "./Estrellas";

type Props = {
  destino: DestinoResumen;
  prioridad?: boolean;
};

export default function TarjetaDestino({ destino, prioridad = false }: Props) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-tarjeta transition duration-300 hover:-translate-y-1 hover:shadow-tarjeta-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-arena-200">
        {destino.imagen_url && (
          <Image
            src={destino.imagen_url}
            alt={destino.nombre}
            fill
            priority={prioridad}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <span className="etiqueta absolute top-3 left-3 bg-white/90 text-tinta shadow-sm backdrop-blur">
          <span aria-hidden>{destino.categoria_icono}</span>
          {destino.categoria_nombre}
        </span>
        <span
          className={`etiqueta absolute top-3 right-3 shadow-sm ${
            Number(destino.precio_entrada) === 0 ? "bg-mar-600 text-white" : "bg-tinta/80 text-white"
          }`}
        >
          {formatoPrecio(destino.precio_entrada)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium tracking-wide text-tinta-suave uppercase">
          {destino.departamento}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold text-tinta">
          <Link href={`/destinos/${destino.slug}`} className="after:absolute after:inset-0">
            {destino.nombre}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-tinta-suave">{destino.resumen}</p>

        <div className="mt-auto flex items-center gap-1.5 pt-4 text-sm">
          {destino.total_resenas > 0 ? (
            <>
              <Estrella className="size-4 text-ocaso-500" />
              <span className="font-semibold">{formatoCalificacion(destino.calificacion_promedio)}</span>
              <span className="text-tinta-suave">
                · {pluralizar(destino.total_resenas, "reseña", "reseñas")}
              </span>
            </>
          ) : (
            <span className="text-tinta-suave">Sin reseñas todavía</span>
          )}
        </div>
      </div>
    </article>
  );
}

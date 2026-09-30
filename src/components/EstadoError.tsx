"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  retry: () => void;
  titulo?: string;
};

/** Interfaz común para los límites de error (error.tsx) de cada segmento. */
export default function EstadoError({ error, retry, titulo = "Algo salió mal" }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="contenedor py-20">
      <div className="mx-auto max-w-lg rounded-3xl border border-arena-200 bg-white p-8 text-center shadow-tarjeta" role="alert">
        <p className="text-5xl" aria-hidden>🌋</p>
        <h1 className="mt-4 font-display text-2xl font-semibold">{titulo}</h1>
        <p className="mt-2 text-sm text-tinta-suave">
          No pudimos cargar esta información. Puede ser un problema temporal de conexión con la base de
          datos; intenta de nuevo en unos segundos.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-tinta-suave/70">Código: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => retry()} className="boton-primario">
            Reintentar
          </button>
          <Link href="/" className="boton-secundario">
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

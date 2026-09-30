"use client";

import { useActionState, useEffect } from "react";
import SelectorEstrellas from "@/components/SelectorEstrellas";
import { guardarResenaPropia } from "@/lib/resenas-propias";
import { crearResena, type EstadoFormulario } from "./actions";

const INICIAL: EstadoFormulario = { ok: false, mensaje: "" };

export default function FormularioResena({ destinoId, slug }: { destinoId: string; slug: string }) {
  const [estado, accion, enviando] = useActionState(crearResena, INICIAL);

  useEffect(() => {
    if (estado.resena) guardarResenaPropia(estado.resena.id, estado.resena.token);
  }, [estado.resena]);

  const v = estado.ok ? undefined : estado.valores;

  return (
    <form action={accion} className="space-y-5" noValidate>
      <input type="hidden" name="destino_id" value={destinoId} />
      <input type="hidden" name="slug" value={slug} />

      {/* key: al publicar, se reinicia el selector */}
      <SelectorEstrellas
        key={estado.resena?.id ?? `c-${v?.calificacion ?? 0}`}
        inicial={v?.calificacion ?? 0}
        idError="error-calificacion"
      />
      {estado.errores?.calificacion && (
        <p id="error-calificacion" className="-mt-3 text-sm text-red-700">{estado.errores.calificacion}</p>
      )}

      <div>
        <label htmlFor="autor" className="text-sm font-medium">Tu nombre</label>
        <input
          id="autor"
          name="autor"
          maxLength={60}
          defaultValue={v?.autor}
          key={`a-${estado.resena?.id ?? v?.autor ?? ""}`}
          placeholder="Ej. Ana López"
          aria-invalid={Boolean(estado.errores?.autor)}
          aria-describedby={estado.errores?.autor ? "error-autor" : undefined}
          className="campo mt-1.5"
        />
        {estado.errores?.autor && <p id="error-autor" className="mt-1 text-sm text-red-700">{estado.errores.autor}</p>}
      </div>

      <div>
        <label htmlFor="comentario" className="text-sm font-medium">Tu experiencia</label>
        <textarea
          id="comentario"
          name="comentario"
          rows={4}
          maxLength={600}
          defaultValue={v?.comentario}
          key={`t-${estado.resena?.id ?? v?.comentario ?? ""}`}
          placeholder="¿Qué te gustó? ¿Algún consejo para otros viajeros?"
          aria-invalid={Boolean(estado.errores?.comentario)}
          aria-describedby={estado.errores?.comentario ? "error-comentario" : undefined}
          className="campo mt-1.5 resize-y"
        />
        {estado.errores?.comentario && (
          <p id="error-comentario" className="mt-1 text-sm text-red-700">{estado.errores.comentario}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="boton-primario" disabled={enviando}>
          {enviando && (
            <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
          )}
          {enviando ? "Publicando…" : "Publicar reseña"}
        </button>
        {estado.mensaje && (
          <p role="status" className={`text-sm font-medium ${estado.ok ? "text-mar-700" : "text-red-700"}`}>
            {estado.mensaje}
          </p>
        )}
      </div>
    </form>
  );
}

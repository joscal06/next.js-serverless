"use client";

import { useState, useTransition } from "react";
import Estrellas from "@/components/Estrellas";
import SelectorEstrellas from "@/components/SelectorEstrellas";
import { olvidarResenaPropia, useTokenResena } from "@/lib/resenas-propias";
import type { Resena } from "@/lib/types";
import { editarResena, eliminarResena } from "./actions";

type Props = {
  resena: Resena;
  slug: string;
  /** Fecha ya formateada en el servidor (evita diferencias de zona horaria al hidratar). */
  fecha: string;
};

export default function ItemResena({ resena, slug, fecha }: Props) {
  const token = useTokenResena(resena.id);
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [pendiente, iniciar] = useTransition();

  const guardar = (datos: FormData) => {
    if (!token) return;
    iniciar(async () => {
      const r = await editarResena(resena.id, token, slug, datos);
      setMensaje(r.ok ? null : r.mensaje);
      if (r.ok) setEditando(false);
    });
  };

  const borrar = () => {
    if (!token) return;
    iniciar(async () => {
      const r = await eliminarResena(resena.id, token, slug);
      if (r.ok) olvidarResenaPropia(resena.id);
      else setMensaje(r.mensaje);
      setConfirmando(false);
    });
  };

  return (
    <li className={`rounded-2xl border bg-white p-5 transition ${token ? "border-mar-500/40 ring-1 ring-mar-100" : "border-arena-200"} ${pendiente ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid size-10 place-items-center rounded-full bg-mar-50 font-display text-lg font-semibold text-mar-700"
          >
            {resena.autor.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold">
              {resena.autor}
              {token && <span className="etiqueta ml-2 bg-mar-50 px-2 py-0.5 text-mar-700">Tu reseña</span>}
            </p>
            <p className="text-xs text-tinta-suave">
              {fecha}
              {resena.updated_at && " · editada"}
            </p>
          </div>
        </div>
        {!editando && <Estrellas valor={resena.calificacion} tamano="sm" />}
      </div>

      {editando ? (
        <form action={guardar} className="mt-4 space-y-4">
          <SelectorEstrellas inicial={resena.calificacion} />
          <label className="sr-only" htmlFor={`editar-${resena.id}`}>Comentario</label>
          <textarea
            id={`editar-${resena.id}`}
            name="comentario"
            rows={3}
            maxLength={600}
            defaultValue={resena.comentario}
            className="campo resize-y"
          />
          <div className="flex gap-2">
            <button type="submit" className="boton-primario py-2" disabled={pendiente}>
              {pendiente ? "Guardando…" : "Guardar cambios"}
            </button>
            <button type="button" className="boton-secundario py-2" onClick={() => setEditando(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-3 leading-relaxed whitespace-pre-line text-tinta">{resena.comentario}</p>
      )}

      {mensaje && <p role="alert" className="mt-3 text-sm text-red-700">{mensaje}</p>}

      {token && !editando && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-arena-100 pt-3 text-sm">
          {confirmando ? (
            <>
              <span className="text-tinta-suave">¿Eliminar tu reseña?</span>
              <button type="button" onClick={borrar} disabled={pendiente} className="rounded-full bg-red-600 px-3 py-1 font-semibold text-white hover:bg-red-700">
                {pendiente ? "Eliminando…" : "Sí, eliminar"}
              </button>
              <button type="button" onClick={() => setConfirmando(false)} className="rounded-full px-3 py-1 font-semibold hover:bg-arena-100">
                No
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => { setMensaje(null); setEditando(true); }} className="rounded-full px-3 py-1 font-semibold text-mar-700 hover:bg-mar-50">
                Editar
              </button>
              <button type="button" onClick={() => setConfirmando(true)} className="rounded-full px-3 py-1 font-semibold text-red-700 hover:bg-red-50">
                Eliminar
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}

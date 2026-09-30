"use server";

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";

export type EstadoFormulario = {
  ok: boolean;
  mensaje: string;
  errores?: Partial<Record<"autor" | "calificacion" | "comentario", string>>;
  /** Solo al crear: credenciales para que el navegador pueda editar/borrar su reseña. */
  resena?: { id: string; token: string };
  /** Valores enviados, para no perder lo escrito si hay errores de validación. */
  valores?: { autor: string; calificacion: number; comentario: string };
};

const UUID = /^[0-9a-f-]{36}$/i;
const SLUG = /^[a-z0-9-]+$/;

function validar(datos: FormData) {
  const autor = String(datos.get("autor") ?? "").trim();
  const comentario = String(datos.get("comentario") ?? "").trim();
  const calificacion = Number(datos.get("calificacion"));
  const errores: EstadoFormulario["errores"] = {};

  if (autor.length < 2 || autor.length > 60) errores.autor = "Escribe un nombre de 2 a 60 caracteres.";
  if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5)
    errores.calificacion = "Elige una calificación de 1 a 5 estrellas.";
  if (comentario.length < 10 || comentario.length > 600)
    errores.comentario = "El comentario debe tener entre 10 y 600 caracteres.";

  return { autor, comentario, calificacion, errores };
}

function refrescar(slug: string) {
  revalidatePath(`/destinos/${slug}`);
  revalidatePath("/destinos");
  revalidatePath("/categorias", "layout");
  revalidatePath("/");
}

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function crearResena(
  _previo: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  const destinoId = String(datos.get("destino_id") ?? "");
  const slug = String(datos.get("slug") ?? "");
  if (!UUID.test(destinoId) || !SLUG.test(slug)) {
    return { ok: false, mensaje: "Solicitud no válida." };
  }

  const { autor, comentario, calificacion, errores } = validar(datos);
  const valores = { autor, comentario, calificacion: Number.isInteger(calificacion) ? calificacion : 0 };
  if (Object.keys(errores).length > 0) {
    return { ok: false, mensaje: "Revisa los campos marcados.", errores, valores };
  }

  const id = randomUUID();
  const token = randomBytes(24).toString("base64url");

  const { error } = await getSupabase().from("resenas").insert({
    id,
    destino_id: destinoId,
    autor,
    calificacion,
    comentario,
    token_hash: hash(token),
  });

  if (error) {
    console.error("[supabase] crearResena:", error.message);
    return { ok: false, mensaje: "No se pudo publicar la reseña. Intenta de nuevo.", valores };
  }

  refrescar(slug);
  return { ok: true, mensaje: "¡Gracias! Tu reseña fue publicada.", resena: { id, token } };
}

export async function editarResena(
  id: string,
  token: string,
  slug: string,
  datos: FormData,
): Promise<EstadoFormulario> {
  if (!UUID.test(id) || !SLUG.test(slug) || !token) return { ok: false, mensaje: "Solicitud no válida." };

  const { comentario, calificacion, errores } = validar(datos);
  delete errores.autor;
  if (Object.keys(errores).length > 0) {
    return { ok: false, mensaje: "Revisa los campos marcados.", errores };
  }

  const { data, error } = await getSupabase().rpc("editar_resena", {
    p_id: id,
    p_token: token,
    p_calificacion: calificacion,
    p_comentario: comentario,
  });

  if (error || data !== true) {
    if (error) console.error("[supabase] editarResena:", error.message);
    return { ok: false, mensaje: "No se pudo editar la reseña (¿fue escrita desde este navegador?)." };
  }

  refrescar(slug);
  return { ok: true, mensaje: "Reseña actualizada." };
}

export async function eliminarResena(id: string, token: string, slug: string): Promise<EstadoFormulario> {
  if (!UUID.test(id) || !SLUG.test(slug) || !token) return { ok: false, mensaje: "Solicitud no válida." };

  const { data, error } = await getSupabase().rpc("eliminar_resena", { p_id: id, p_token: token });

  if (error || data !== true) {
    if (error) console.error("[supabase] eliminarResena:", error.message);
    return { ok: false, mensaje: "No se pudo eliminar la reseña." };
  }

  refrescar(slug);
  return { ok: true, mensaje: "Reseña eliminada." };
}

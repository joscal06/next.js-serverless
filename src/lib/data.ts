import "server-only";
import { cache } from "react";
import { getSupabase } from "./supabase";
import type {
  Categoria,
  Destino,
  DestinoResumen,
  FiltrosDestinos,
  OrdenDestinos,
  Resena,
} from "./types";

export const POR_PAGINA = 6;

const ORDENES: Record<OrdenDestinos, { columna: string; ascending: boolean }> = {
  nombre: { columna: "nombre", ascending: true },
  calificacion: { columna: "calificacion_promedio", ascending: false },
  precio: { columna: "precio_entrada", ascending: true },
  recientes: { columna: "created_at", ascending: false },
};

/** Convierte un error de Supabase en una excepción legible (la captura error.tsx). */
function fallo(contexto: string, error: { message: string }): never {
  console.error(`[supabase] ${contexto}:`, error.message);
  throw new Error(`No se pudo cargar ${contexto}.`);
}

// `cache` deduplica llamadas idénticas dentro de un mismo render
// (p. ej. generateMetadata + page piden el mismo destino).

export const getCategorias = cache(async (): Promise<Categoria[]> => {
  const { data, error } = await getSupabase()
    .from("categorias")
    .select("id, slug, nombre, descripcion, icono, color, imagen_url, orden")
    .order("orden");
  if (error) fallo("las categorías", error);
  return data;
});

export const getCategoria = cache(async (slug: string): Promise<Categoria | null> => {
  const { data, error } = await getSupabase()
    .from("categorias")
    .select("id, slug, nombre, descripcion, icono, color, imagen_url, orden")
    .eq("slug", slug)
    .maybeSingle();
  if (error) fallo("la categoría", error);
  return data;
});

export async function getDestinos(filtros: FiltrosDestinos = {}) {
  const orden = ORDENES[filtros.orden ?? "nombre"] ?? ORDENES.nombre;
  const pagina = Math.max(1, filtros.pagina ?? 1);
  const desde = (pagina - 1) * POR_PAGINA;

  let query = getSupabase()
    .from("vista_destinos")
    .select("*", { count: "exact" })
    .order(orden.columna, { ascending: orden.ascending })
    .order("nombre")
    .range(desde, desde + POR_PAGINA - 1);

  if (filtros.categoria) query = query.eq("categoria_slug", filtros.categoria);
  if (filtros.q) {
    // Se escapan los caracteres especiales del filtro `or` de PostgREST.
    const q = filtros.q.replace(/[%_,.()]/g, " ").trim();
    if (q) query = query.or(`nombre.ilike.%${q}%,departamento.ilike.%${q}%,resumen.ilike.%${q}%`);
  }

  const { data, error, count } = await query;
  if (error) fallo("los destinos", error);

  const total = count ?? 0;
  return {
    destinos: data as DestinoResumen[],
    total,
    pagina,
    totalPaginas: Math.max(1, Math.ceil(total / POR_PAGINA)),
  };
}

export const getDestinosDestacados = cache(async (limite = 6): Promise<DestinoResumen[]> => {
  const { data, error } = await getSupabase()
    .from("vista_destinos")
    .select("*")
    .eq("destacado", true)
    .order("calificacion_promedio", { ascending: false })
    .limit(limite);
  if (error) fallo("los destinos destacados", error);
  return data;
});

export const getDestinosPorCategoria = cache(
  async (categoriaSlug: string, excluirSlug?: string): Promise<DestinoResumen[]> => {
    let query = getSupabase()
      .from("vista_destinos")
      .select("*")
      .eq("categoria_slug", categoriaSlug)
      .order("calificacion_promedio", { ascending: false });
    if (excluirSlug) query = query.neq("slug", excluirSlug);

    const { data, error } = await query;
    if (error) fallo("los destinos de la categoría", error);
    return data;
  },
);

export const getDestino = cache(async (slug: string): Promise<Destino | null> => {
  const { data, error } = await getSupabase()
    .from("destinos")
    .select(
      "id, slug, nombre, departamento, resumen, descripcion, imagen_url, imagen_credito, precio_entrada, mejor_epoca, duracion, actividades, destacado, categoria:categorias!inner(slug, nombre, icono, color)",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) fallo("el destino", error);
  return data as Destino | null;
});

export async function getResenas(destinoId: string): Promise<Resena[]> {
  const { data, error } = await getSupabase()
    .from("resenas")
    .select("id, destino_id, autor, calificacion, comentario, created_at, updated_at")
    .eq("destino_id", destinoId)
    .order("created_at", { ascending: false });
  if (error) fallo("las reseñas", error);
  return data;
}

export type ResenaReciente = Resena & { destino: { slug: string; nombre: string } };

export async function getResenasRecientes(limite = 3): Promise<ResenaReciente[]> {
  const { data, error } = await getSupabase()
    .from("resenas")
    .select(
      "id, destino_id, autor, calificacion, comentario, created_at, updated_at, destino:destinos!inner(slug, nombre)",
    )
    .gte("calificacion", 4)
    .order("created_at", { ascending: false })
    .limit(limite);
  if (error) fallo("las reseñas recientes", error);
  return data as unknown as ResenaReciente[];
}

/** Número de destinos por categoría, en una sola consulta. */
export async function getConteoPorCategoria(): Promise<Record<string, number>> {
  const { data, error } = await getSupabase().from("vista_destinos").select("categoria_slug");
  if (error) fallo("el conteo de destinos", error);
  return data.reduce<Record<string, number>>((acc, { categoria_slug }) => {
    acc[categoria_slug] = (acc[categoria_slug] ?? 0) + 1;
    return acc;
  }, {});
}

export async function getSlugsDestinos(): Promise<string[]> {
  const { data, error } = await getSupabase().from("destinos").select("slug");
  if (error) fallo("los destinos", error);
  return data.map((d) => d.slug);
}

export async function getSlugsCategorias(): Promise<string[]> {
  const { data, error } = await getSupabase().from("categorias").select("slug");
  if (error) fallo("las categorías", error);
  return data.map((c) => c.slug);
}

export async function getEstadisticas() {
  const supabase = getSupabase();
  const [destinos, categorias, resenas] = await Promise.all([
    supabase.from("destinos").select("*", { count: "exact", head: true }),
    supabase.from("categorias").select("*", { count: "exact", head: true }),
    supabase.from("resenas").select("id", { count: "exact", head: true }),
  ]);
  const error = destinos.error ?? categorias.error ?? resenas.error;
  if (error) fallo("las estadísticas", error);
  return {
    destinos: destinos.count ?? 0,
    categorias: categorias.count ?? 0,
    resenas: resenas.count ?? 0,
  };
}

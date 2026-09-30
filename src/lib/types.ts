export type Categoria = {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  imagen_url: string | null;
  orden: number;
};

/** Fila de la vista `vista_destinos` (destino + categoría + promedio de reseñas). */
export type DestinoResumen = {
  id: string;
  slug: string;
  nombre: string;
  departamento: string;
  resumen: string;
  imagen_url: string | null;
  precio_entrada: number;
  destacado: boolean;
  categoria_slug: string;
  categoria_nombre: string;
  categoria_icono: string;
  calificacion_promedio: number;
  total_resenas: number;
};

export type Destino = {
  id: string;
  slug: string;
  nombre: string;
  departamento: string;
  resumen: string;
  descripcion: string;
  imagen_url: string | null;
  imagen_credito: string | null;
  precio_entrada: number;
  mejor_epoca: string | null;
  duracion: string | null;
  actividades: string[];
  destacado: boolean;
  categoria: Pick<Categoria, "slug" | "nombre" | "icono" | "color">;
};

export type Resena = {
  id: string;
  destino_id: string;
  autor: string;
  calificacion: number;
  comentario: string;
  created_at: string;
  updated_at: string | null;
};

export type OrdenDestinos = "nombre" | "calificacion" | "precio" | "recientes";

export type FiltrosDestinos = {
  q?: string;
  categoria?: string;
  orden?: OrdenDestinos;
  pagina?: number;
};

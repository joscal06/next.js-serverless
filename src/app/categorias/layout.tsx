import { getCategorias } from "@/lib/data";
import NavCategorias from "./NavCategorias";

/**
 * Layout anidado de /categorias y /categorias/[slug]: la barra de categorías
 * se obtiene en el servidor una sola vez y se conserva al navegar entre ellas.
 */
export default async function LayoutCategorias({ children }: LayoutProps<"/categorias">) {
  const categorias = await getCategorias();

  return (
    <>
      <div className="sticky top-16 z-30 border-b border-arena-200 bg-arena-50/90 backdrop-blur-md">
        <NavCategorias
          categorias={categorias.map(({ slug, nombre, icono }) => ({ slug, nombre, icono }))}
        />
      </div>
      {children}
    </>
  );
}

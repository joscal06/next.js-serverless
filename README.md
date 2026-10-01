# Destinos SV 🌋

Guía turística de El Salvador construida con **Next.js 16 (App Router)** y **Supabase**. Reúne playas, volcanes, lagos, pueblos, sitios arqueológicos y áreas naturales del país, con fichas de cada destino, búsqueda con filtros y reseñas de viajeros que se pueden crear, editar y eliminar.

- **Sitio en producción:** _(agregar URL de Vercel)_
- **Repositorio:** https://github.com/joscal06/next.js-serverless

## Funcionalidades

- **Landing page** con portada, estadísticas en vivo, categorías, destinos destacados y reseñas recientes.
- **Listado de destinos** (`/destinos`) con búsqueda de texto, filtro por categoría, orden y paginación mediante `searchParams`.
- **Ruta dinámica `/destinos/[slug]`**: ficha completa del destino, promedio y distribución de calificaciones, reseñas y destinos relacionados.
- **Ruta dinámica `/categorias/[slug]`**: destinos de una categoría.
- **Reseñas (CRUD):** cualquier visitante puede publicar una reseña y después editarla o eliminarla desde el mismo navegador, sin necesidad de cuenta.
- Diseño responsive, estados de carga (esqueletos) y manejo de errores por segmento.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| Next.js 16.3 (App Router) + React 19 | Server Components, Server Actions, SSG/ISR |
| TypeScript | Tipado de datos y rutas (`PageProps`, `LayoutProps`) |
| Tailwind CSS 4 | Estilos y diseño responsive |
| Supabase (PostgreSQL) | Base de datos, RLS, vista y funciones SQL |
| Vercel | Despliegue |

## Arquitectura

```
src/
├── app/
│   ├── layout.tsx               # Layout raíz: fuentes, metadatos, encabezado y pie
│   ├── page.tsx                 # Landing page (ISR)
│   ├── loading.tsx · error.tsx · not-found.tsx · global-error.tsx
│   ├── destinos/
│   │   ├── layout.tsx           # Layout anidado (consejos de viaje)
│   │   ├── page.tsx             # Búsqueda, filtros y paginación con searchParams
│   │   ├── loading.tsx · error.tsx
│   │   └── [slug]/
│   │       ├── page.tsx         # generateStaticParams + generateMetadata + notFound
│   │       ├── actions.ts       # Server Actions: crear / editar / eliminar reseña
│   │       ├── FormularioResena.tsx · ItemResena.tsx   # Client Components
│   │       └── loading.tsx · error.tsx · not-found.tsx
│   └── categorias/
│       ├── layout.tsx           # Layout anidado con la barra de categorías
│       ├── page.tsx · loading.tsx · error.tsx
│       └── [slug]/              # generateStaticParams + dynamicParams = false
├── components/                  # Tarjetas, estrellas, paginación, esqueletos, errores
└── lib/
    ├── supabase.ts              # Cliente de Supabase (solo servidor)
    ├── data.ts                  # Consultas a la base de datos
    ├── resenas-propias.ts       # Tokens de reseñas propias en localStorage
    └── types.ts · formato.ts
supabase/
├── schema.sql                   # Tablas, vista, RLS, privilegios y funciones
└── seed.sql                     # 6 categorías, 16 destinos y 22 reseñas
```

**Server vs. Client Components.** Todas las páginas y layouts son Server Components que consultan Supabase directamente. Solo son Client Components las piezas interactivas: el menú móvil, la barra de categorías activa, el formulario de reseñas y las acciones de editar/eliminar.

**Renderizado.** Las rutas `[slug]` se generan en el build con `generateStaticParams` y se regeneran con ISR (`revalidate = 300`). Al publicar, editar o borrar una reseña, la Server Action llama a `revalidatePath` y la página se actualiza al instante. `/destinos` se renderiza en cada petición porque depende de `searchParams`.

## Base de datos

Tres tablas relacionadas:

- `categorias` (6 registros): `slug`, `nombre`, `descripcion`, `icono`, `color`, `imagen_url`.
- `destinos` (16 registros): pertenece a una categoría; incluye descripción, precio de entrada, época recomendada, actividades (`text[]`), etc.
- `resenas` (22 registros de ejemplo): pertenece a un destino; `calificacion` de 1 a 5 y `token_hash`.

Además hay una vista `vista_destinos` (con `security_invoker`) que calcula el promedio y el total de reseñas de cada destino.

### Seguridad (RLS)

- RLS está activado en las tres tablas.
- `categorias` y `destinos` son **solo lectura** para el rol `anon`.
- `resenas` permite **SELECT** e **INSERT** con validaciones (`with check`: calificación de 1 a 5, longitud mínima del nombre y del comentario, token obligatorio).
- No existen políticas de UPDATE ni de DELETE. Las reseñas solo se modifican con las funciones `editar_resena` y `eliminar_resena` (`security definer`), que comparan el hash SHA-256 del token del autor.
- Con privilegios por columna, la columna `token_hash` nunca se puede leer desde la API.
- La clave de Supabase solo se usa en el servidor: nunca se envía al navegador.

## Instalación local

Requisitos: Node.js 20.9 o superior y una cuenta gratuita de [Supabase](https://supabase.com).

1. **Clonar e instalar dependencias**

   ```bash
   git clone https://github.com/joscal06/next.js-serverless.git
   cd next.js-serverless
   npm install
   ```

2. **Crear la base de datos.** En Supabase, crea un proyecto y abre **SQL Editor**. Ejecuta primero el contenido de `supabase/schema.sql` y después el de `supabase/seed.sql`.

3. **Configurar las variables de entorno**

   ```bash
   cp .env.example .env.local
   ```

   Completa los valores con los datos de **Project Settings → API**.

4. **Ejecutar**

   ```bash
   npm run dev      # desarrollo en http://localhost:3000
   npm run build    # compilación de producción
   npm start
   ```

## Variables de entorno

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `SUPABASE_URL` | Sí | URL del proyecto de Supabase (`https://xxxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | Sí | Clave pública `anon` / `publishable`. Solo se usa en el servidor |
| `NEXT_PUBLIC_SITE_URL` | No | URL pública del sitio, para las etiquetas Open Graph |

El archivo `.env.local` está excluido del repositorio. No subas credenciales reales.

## Despliegue en Vercel

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new).
2. En **Environment Variables** agrega `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `NEXT_PUBLIC_SITE_URL`.
3. Haz clic en **Deploy**. Las variables deben existir antes del build, porque `generateStaticParams` consulta Supabase durante la compilación.

## Créditos

Las fotografías provienen de Wikimedia Commons y tienen licencias libres (CC BY-SA, CC BY, CC0 o dominio público). El autor y la licencia de cada foto aparecen en la página del destino. Los precios de entrada son referenciales.

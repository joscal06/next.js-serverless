import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="contenedor py-24 text-center">
      <p className="font-display text-8xl font-semibold text-mar-600">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Este camino no lleva a ningún lado</h1>
      <p className="mx-auto mt-3 max-w-md text-tinta-suave">
        La página que buscas no existe o fue movida. Te sugerimos volver a explorar los destinos.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/destinos" className="boton-primario">
          Explorar destinos
        </Link>
        <Link href="/" className="boton-secundario">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function DestinoNoEncontrado() {
  return (
    <div className="contenedor py-24 text-center">
      <p className="text-6xl" aria-hidden>🗺️</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">No encontramos ese destino</h1>
      <p className="mx-auto mt-3 max-w-md text-tinta-suave">
        Puede que el enlace esté mal escrito o que el destino ya no forme parte de la guía.
      </p>
      <Link href="/destinos" className="boton-primario mt-8">
        Ver todos los destinos
      </Link>
    </div>
  );
}

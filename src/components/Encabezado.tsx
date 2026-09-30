"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ENLACES = [
  { href: "/", texto: "Inicio" },
  { href: "/destinos", texto: "Destinos" },
  { href: "/categorias", texto: "Categorías" },
];

export default function Encabezado() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [conScroll, setConScroll] = useState(false);

  // Cierra el menú móvil al navegar.
  const [rutaAnterior, setRutaAnterior] = useState(ruta);
  if (ruta !== rutaAnterior) {
    setRutaAnterior(ruta);
    setAbierto(false);
  }

  useEffect(() => {
    const alScroll = () => setConScroll(window.scrollY > 8);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  const activo = (href: string) => (href === "/" ? ruta === "/" : ruta.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        conScroll || abierto
          ? "border-arena-200 bg-arena-50/90 backdrop-blur-md"
          : "border-transparent bg-arena-50/70 backdrop-blur-sm"
      }`}
    >
      <nav className="contenedor flex h-16 items-center justify-between" aria-label="Principal">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-tinta">
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-full bg-mar-600 text-lg text-white shadow-sm"
          >
            🌋
          </span>
          Destinos <span className="text-ocaso-500">SV</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                aria-current={activo(e.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activo(e.href)
                    ? "bg-mar-600 text-white"
                    : "text-tinta-suave hover:bg-arena-100 hover:text-tinta"
                }`}
              >
                {e.texto}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/destinos?orden=calificacion" className="boton-acento hidden md:inline-flex">
          Mejor valorados
        </Link>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full text-tinta hover:bg-arena-100 md:hidden"
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2}>
            {abierto ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {abierto && (
        <ul id="menu-movil" className="contenedor flex flex-col gap-1 pb-4 md:hidden">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                aria-current={activo(e.href) ? "page" : undefined}
                className={`block rounded-xl px-4 py-3 font-medium ${
                  activo(e.href) ? "bg-mar-600 text-white" : "text-tinta hover:bg-arena-100"
                }`}
              >
                {e.texto}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

"use client";

import { useSyncExternalStore } from "react";

/**
 * Guarda en el navegador los tokens de las reseñas escritas por este visitante.
 * El token permite editar/eliminar la reseña propia sin crear una cuenta:
 * la base de datos solo guarda su hash SHA-256 y lo verifica en las funciones
 * `editar_resena` / `eliminar_resena`.
 */
const CLAVE = "destinos-sv:resenas-propias";
const EVENTO = "destinos-sv:resenas-propias";

type Mapa = Record<string, string>;

function leerCrudo(): string | null {
  try {
    return window.localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

function leer(): Mapa {
  try {
    return JSON.parse(leerCrudo() ?? "{}") as Mapa;
  } catch {
    return {};
  }
}

function escribir(mapa: Mapa) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(mapa));
  } catch {
    // Modo privado o almacenamiento bloqueado: la reseña se publica igual,
    // solo que no se podrá editar desde este navegador.
  }
  window.dispatchEvent(new Event(EVENTO));
}

export function guardarResenaPropia(id: string, token: string) {
  escribir({ ...leer(), [id]: token });
}

export function olvidarResenaPropia(id: string) {
  const mapa = leer();
  delete mapa[id];
  escribir(mapa);
}

function suscribir(aviso: () => void) {
  window.addEventListener(EVENTO, aviso);
  window.addEventListener("storage", aviso);
  return () => {
    window.removeEventListener(EVENTO, aviso);
    window.removeEventListener("storage", aviso);
  };
}

/** Devuelve el token de la reseña si fue escrita en este navegador; si no, `null`. */
export function useTokenResena(id: string): string | null {
  const crudo = useSyncExternalStore(suscribir, leerCrudo, () => null);
  if (!crudo) return null;
  try {
    return (JSON.parse(crudo) as Mapa)[id] ?? null;
  } catch {
    return null;
  }
}

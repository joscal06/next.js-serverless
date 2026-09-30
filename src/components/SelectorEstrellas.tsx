"use client";

import { useState } from "react";
import { Estrella } from "./Estrellas";

const TEXTOS = ["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"];

type Props = {
  nombre?: string;
  inicial?: number;
  idError?: string;
};

/** Grupo de radios accesible con apariencia de estrellas. */
export default function SelectorEstrellas({ nombre = "calificacion", inicial = 0, idError }: Props) {
  const [valor, setValor] = useState(inicial);
  const [hover, setHover] = useState(0);
  const mostrado = hover || valor;

  return (
    <fieldset aria-describedby={idError}>
      <legend className="text-sm font-medium">Calificación</legend>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer p-0.5" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name={nombre}
                value={n}
                checked={valor === n}
                onChange={() => setValor(n)}
                className="peer sr-only"
              />
              <span className="sr-only">{`${n} ${n === 1 ? "estrella" : "estrellas"}`}</span>
              <Estrella
                className={`size-8 rounded transition peer-focus-visible:outline-2 peer-focus-visible:outline-mar-600 ${
                  n <= mostrado ? "text-ocaso-500" : "text-arena-200"
                } ${n <= hover ? "scale-110" : ""}`}
              />
            </label>
          ))}
        </div>
        <span className="text-sm font-medium text-tinta-suave" aria-live="polite">
          {TEXTOS[mostrado]}
        </span>
      </div>
    </fieldset>
  );
}

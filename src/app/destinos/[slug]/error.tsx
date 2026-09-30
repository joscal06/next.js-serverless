"use client"; // Los límites de error deben ser Client Components

import EstadoError from "@/components/EstadoError";

export default function ErrorDestino({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <EstadoError error={error} retry={retry} titulo="No pudimos cargar este destino" />;
}

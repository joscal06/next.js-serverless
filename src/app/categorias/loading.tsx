import { EsqueletoEncabezado } from "@/components/Esqueletos";

export default function CargandoCategorias() {
  return (
    <div className="contenedor pt-12">
      <EsqueletoEncabezado />
      <div className="mt-10 grid gap-6 md:grid-cols-2" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="esqueleto h-52 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

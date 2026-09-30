import { EsqueletoEncabezado, EsqueletoGrilla } from "@/components/Esqueletos";

export default function CargandoDestinos() {
  return (
    <div className="contenedor pt-12">
      <EsqueletoEncabezado />
      <div className="esqueleto mt-8 h-20 w-full rounded-3xl" />
      <div className="mt-5 flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="esqueleto h-9 w-28 rounded-full" />
        ))}
      </div>
      <div className="mt-10">
        <EsqueletoGrilla />
      </div>
    </div>
  );
}

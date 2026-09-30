import { EsqueletoGrilla } from "@/components/Esqueletos";

export default function Cargando() {
  return (
    <div>
      <div className="esqueleto h-[70vh] rounded-none" aria-hidden />
      <div className="contenedor pt-16">
        <div className="esqueleto h-9 w-72" aria-hidden />
        <div className="mt-8">
          <EsqueletoGrilla cantidad={3} />
        </div>
      </div>
    </div>
  );
}

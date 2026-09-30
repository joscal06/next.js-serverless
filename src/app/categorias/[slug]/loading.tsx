import { EsqueletoGrilla } from "@/components/Esqueletos";

export default function CargandoCategoria() {
  return (
    <>
      <div className="esqueleto h-80 rounded-none" aria-hidden />
      <div className="contenedor mt-12">
        <EsqueletoGrilla cantidad={3} />
      </div>
    </>
  );
}

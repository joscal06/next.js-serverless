const moneda = new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" });
const fecha = new Intl.DateTimeFormat("es-SV", { day: "numeric", month: "long", year: "numeric" });

export function formatoPrecio(valor: number): string {
  return Number(valor) === 0 ? "Gratis" : moneda.format(Number(valor));
}

export function formatoFecha(iso: string): string {
  return fecha.format(new Date(iso));
}

export function formatoCalificacion(valor: number): string {
  return Number(valor).toFixed(1);
}

export function pluralizar(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

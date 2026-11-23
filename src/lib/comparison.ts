import type { Ciudad, Clima } from "./open-meteo/types.ts";

export function seleccionarCiudad(
  cities: [Ciudad | null, Ciudad | null],
  index: 0 | 1,
  city: Ciudad,
): [Ciudad | null, Ciudad | null] | null {
  if (cities[index === 0 ? 1 : 0]?.id === city.id) return null;
  const next: [Ciudad | null, Ciudad | null] = [...cities];
  next[index] = city;
  return next;
}
export function intercambiar(
  cities: [Ciudad | null, Ciudad | null],
): [Ciudad | null, Ciudad | null] {
  return [cities[1], cities[0]];
}
export function diferencia(
  a: number | null | undefined,
  b: number | null | undefined,
): number | null {
  return a == null || b == null || !Number.isFinite(a) || !Number.isFinite(b)
    ? null
    : Math.round((a - b) * 10) / 10;
}
export function fechaEnZona(instant: string | null | undefined, zone: string): string | null {
  if (!instant || !Number.isFinite(Date.parse(instant))) return null;
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date(instant));
    const part = (name: string) => parts.find((item) => item.type === name)?.value;
    const year = part("year"),
      month = part("month"),
      day = part("day");
    return year && month && day ? `${year}-${month}-${day}` : null;
  } catch {
    return null;
  }
}
export function datosDelDia(weather: Clima) {
  const date = fechaEnZona(weather.actual?.hora, weather.zonaHoraria);
  return date ? (weather.dias.find((day) => day.fecha === date) ?? null) : null;
}
export async function consultarClima(city: Ciudad, signal: AbortSignal): Promise<Clima> {
  const params = new URLSearchParams({
    latitud: String(city.latitud),
    longitud: String(city.longitud),
  });
  const response = await fetch(`/api/clima?${params}`, { signal });
  if (!response.ok) throw new Error("No se pudo consultar el clima de esta ciudad.");
  return (await response.json()) as Clima;
}

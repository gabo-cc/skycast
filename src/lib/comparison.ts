import type { Ciudad, Clima } from "./open-meteo/types.ts";
export type ClimaComparable = Pick<Clima, "zonaHoraria" | "actual" | "dias">;

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
export function datosDelDia(weather: ClimaComparable) {
  const date = fechaEnZona(weather.actual?.hora, weather.zonaHoraria);
  return date ? (weather.dias.find((day) => day.fecha === date) ?? null) : null;
}
export async function consultarClima(
  city: Pick<Ciudad, "latitud" | "longitud">,
  signal: AbortSignal,
): Promise<ClimaComparable> {
  const params = new URLSearchParams({
    latitud: String(city.latitud),
    longitud: String(city.longitud),
  });
  const response = await fetch(`/api/clima?${params}`, { signal });
  if (!response.ok) throw new Error("No se pudo consultar el clima de esta ciudad.");
  const data: unknown = await response.json();
  if (!esClimaComparable(data)) throw new Error("La respuesta meteorológica no es válida.");
  return data;
}

function esClimaComparable(value: unknown): value is ClimaComparable {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  if (typeof data.zonaHoraria !== "string" || !data.zonaHoraria.trim() || !Array.isArray(data.dias))
    return false;
  try {
    new Intl.DateTimeFormat("es", { timeZone: data.zonaHoraria });
  } catch {
    return false;
  }
  const validNumber = (item: unknown) =>
    item === null || (typeof item === "number" && Number.isFinite(item));
  const current = data.actual;
  if (current !== null) {
    if (!current || typeof current !== "object" || Array.isArray(current)) return false;
    const item = current as Record<string, unknown>;
    if (
      !(
        item.hora === null ||
        (typeof item.hora === "string" && Number.isFinite(Date.parse(item.hora)))
      ) ||
      ![
        item.temperatura,
        item.sensacionTermica,
        item.humedad,
        item.viento,
        item.codigoMeteorologico,
      ].every(validNumber) ||
      ![true, false, null].includes(item.esDeDia as boolean | null)
    )
      return false;
  }
  return data.dias.every((day: unknown) => {
    if (!day || typeof day !== "object" || Array.isArray(day)) return false;
    const item = day as Record<string, unknown>;
    return (
      typeof item.fecha === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(item.fecha) &&
      [
        item.temperaturaMaxima,
        item.temperaturaMinima,
        item.probabilidadPrecipitacionMaxima,
        item.codigoMeteorologico,
      ].every(validNumber)
    );
  });
}

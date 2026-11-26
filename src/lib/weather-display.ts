export type WeatherIcon = "sun" | "moon" | "cloud" | "rain" | "snow" | "storm";
const codes: Record<number, [string, WeatherIcon]> = {
  0: ["Despejado", "sun"],
  1: ["Mayormente despejado", "sun"],
  2: ["Parcialmente nublado", "cloud"],
  3: ["Nublado", "cloud"],
  45: ["Niebla", "cloud"],
  48: ["Niebla con escarcha", "cloud"],
  51: ["Llovizna ligera", "rain"],
  53: ["Llovizna moderada", "rain"],
  55: ["Llovizna intensa", "rain"],
  56: ["Llovizna helada ligera", "rain"],
  57: ["Llovizna helada intensa", "rain"],
  61: ["Lluvia ligera", "rain"],
  63: ["Lluvia moderada", "rain"],
  65: ["Lluvia intensa", "rain"],
  66: ["Lluvia helada ligera", "rain"],
  67: ["Lluvia helada intensa", "rain"],
  71: ["Nevada ligera", "snow"],
  73: ["Nevada moderada", "snow"],
  75: ["Nevada intensa", "snow"],
  77: ["Granos de nieve", "snow"],
  80: ["Chubascos ligeros", "rain"],
  81: ["Chubascos moderados", "rain"],
  82: ["Chubascos fuertes", "rain"],
  85: ["Chubascos de nieve ligeros", "snow"],
  86: ["Chubascos de nieve intensos", "snow"],
  95: ["Tormenta", "storm"],
  96: ["Tormenta con granizo ligero", "storm"],
  97: ["Tormenta fuerte", "storm"],
  99: ["Tormenta con granizo intenso", "storm"],
};
export function condicion(
  code: number | null,
  day: boolean | null = null,
): { descripcion: string; icono: WeatherIcon } {
  const entry = code === null ? undefined : codes[code];
  if (!entry) return { descripcion: "Condición no disponible", icono: "cloud" };
  return { descripcion: entry[0], icono: entry[1] === "sun" && day === false ? "moon" : entry[1] };
}
export function estiloClima(code: number | null, day: boolean | null): string {
  if (day === false) return "weather-night";
  const icon = condicion(code, day).icono;
  if (icon === "storm") return "weather-storm";
  if (icon === "rain" || icon === "snow") return "weather-rainy";
  if (icon === "sun") return "weather-sunny";
  return "weather-cloudy";
}
export function valor(value: number | null, unit: string): string {
  return value === null ? "No disponible" : `${value}${unit}`;
}
// Las fechas diarias son etiquetas de calendario y no representan instantes.
export function fechaLocal(value: string | null, includeTime = false): string {
  if (!value) return "No disponible";
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(value);
  if (!match) return "No disponible";
  const [, year, month, day, hour, minute] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  )
    return "No disponible";
  if (includeTime && (!hour || !minute || Number(hour) > 23 || Number(minute) > 59))
    return "No disponible";
  const formatted = new Intl.DateTimeFormat("es", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
  return includeTime ? `${formatted}, ${hour}:${minute}` : formatted;
}

export function instanteLocal(value: string | null, timeZone: string, hour12 = false): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value))
    return "No disponible";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "No disponible";
  try {
    return new Intl.DateTimeFormat("es", {
      timeZone,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12,
      timeZoneName: "shortOffset",
    }).format(date);
  } catch {
    return "No disponible";
  }
}

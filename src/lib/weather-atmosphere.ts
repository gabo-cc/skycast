export type WeatherAtmosphereKind =
  | "neutral"
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "drizzle"
  | "rain"
  | "storm"
  | "clear-night"
  | "cloudy-night";

export function clasificarAmbiente(
  code: number | null,
  isDay: boolean | null,
): WeatherAtmosphereKind {
  if (code === null || isDay === null) return "neutral";
  if ([95, 96, 97, 99].includes(code)) return "storm";
  if ([51, 53, 55, 56, 57].includes(code)) return "drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([0, 1].includes(code)) return isDay ? "sunny" : "clear-night";
  if (code === 2) return isDay ? "partly-cloudy" : "cloudy-night";
  if ([3, 45, 48, 71, 73, 75, 77, 85, 86].includes(code)) return isDay ? "cloudy" : "cloudy-night";
  return "neutral";
}

export function capasAmbiente(kind: WeatherAtmosphereKind) {
  return {
    nubes: ["partly-cloudy", "cloudy", "cloudy-night", "drizzle", "rain", "storm"].includes(kind),
    estrellas: kind === "clear-night",
    luna: kind === "clear-night",
    sol: kind === "sunny",
    lluvia: kind === "drizzle" || kind === "rain" || kind === "storm" ? kind : null,
  };
}

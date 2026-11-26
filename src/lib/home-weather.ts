import type { Clima } from "./open-meteo/types.ts";

export function horasDeInicio(weather: Clima): Clima["horas"] {
  const instant = weather.actual?.hora ? Date.parse(weather.actual.hora) : NaN;
  const currentHour = Number.isFinite(instant) ? Math.floor(instant / 3_600_000) * 3_600_000 : null;

  return weather.horas
    .filter((hour) => currentHour === null || Date.parse(hour.hora) >= currentHour)
    .slice(0, 24);
}

export function lecturaDeInicio(weather: Clima, selectedHour: string | null) {
  const selected = horasDeInicio(weather).find((hour) => hour.hora === selectedHour);
  return { selected, reading: selected ?? weather.actual };
}

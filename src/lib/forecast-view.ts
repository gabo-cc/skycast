import type { Clima } from "./open-meteo/types.ts";

export function diaSeleccionado(days: Clima["dias"], index: number): Clima["dias"][number] | null {
  return Number.isInteger(index) && index >= 0 && index < Math.min(days.length, 7)
    ? days[index]
    : null;
}

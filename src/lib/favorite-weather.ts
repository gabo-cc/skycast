import { consultarClima, type ClimaComparable } from "./comparison.ts";
import type { Ciudad } from "./open-meteo/types.ts";

// Limitamos las consultas simultáneas y reutilizamos resultados recientes por coordenadas.
export function crearColaClima(limite = 3, vigencia = 5 * 60_000) {
  let activas = 0;
  const espera: (() => void)[] = [];
  const cache = new Map<string, { weather: ClimaComparable; expires: number }>();

  function avanzar() {
    while (activas < limite && espera.length) espera.shift()?.();
  }

  return function consultar(
    city: Pick<Ciudad, "latitud" | "longitud">,
    signal: AbortSignal,
  ): Promise<ClimaComparable> {
    const key = `${city.latitud},${city.longitud}`;
    const saved = cache.get(key);
    if (saved && saved.expires > Date.now() && !signal.aborted) {
      return Promise.resolve(saved.weather);
    }
    cache.delete(key);

    return new Promise((resolve, reject) => {
      const cancel = () => {
        const index = espera.indexOf(start);
        if (index !== -1) {
          espera.splice(index, 1);
          reject(signal.reason);
        }
      };
      const start = () => {
        signal.removeEventListener("abort", cancel);
        if (signal.aborted) {
          reject(signal.reason);
          return;
        }
        const recent = cache.get(key);
        if (recent && recent.expires > Date.now()) {
          resolve(recent.weather);
          return;
        }
        activas += 1;
        consultarClima(city, signal)
          .then((weather) => {
            if (!signal.aborted) cache.set(key, { weather, expires: Date.now() + vigencia });
            resolve(weather);
          }, reject)
          .finally(() => {
            activas -= 1;
            avanzar();
          });
      };
      if (signal.aborted) {
        reject(signal.reason);
        return;
      }
      signal.addEventListener("abort", cancel, { once: true });
      espera.push(start);
      avanzar();
    });
  };
}

export const consultarClimaFavorito = crearColaClima();

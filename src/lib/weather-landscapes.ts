import type { Ciudad } from "./open-meteo/types.ts";
import type { FotoCiudad } from "./city-photo.ts";
import { clasificarAmbiente } from "./weather-atmosphere.ts";

type IdentidadPaisaje = Pick<Ciudad, "id" | "latitud" | "longitud">;

const paisajes = {
  sunny: ["/weather/sunny.webp", "/weather/alt-sunny.webp"],
  partlyCloudy: ["/weather/partly-cloudy.webp", "/weather/alt-partly-cloudy.webp"],
  cloudy: ["/weather/cloudy.webp", "/weather/alt-cloudy.webp"],
  drizzle: ["/weather/drizzle.webp", "/weather/alt-drizzle.webp"],
  rain: ["/weather/rain.webp", "/weather/alt-rain.webp"],
  storm: ["/weather/storm.webp", "/weather/alt-rain.webp"],
  clearNight: ["/weather/clear-night.webp", "/weather/alt-clear-night.webp"],
  cloudyNight: ["/weather/cloudy-night.webp", "/weather/alt-cloudy-night.webp"],
  rainNight: ["/weather/alt-rain-night.webp", "/weather/alt-storm-night.webp"],
  snowDay: ["/weather/alt-snow-day-1.webp", "/weather/alt-snow-day-2.webp"],
  snowNight: ["/weather/alt-snow-night-1.webp", "/weather/alt-snow-night-2.webp"],
} as const;

export type CategoriaPaisaje = keyof typeof paisajes;
const sinPaisajes: readonly string[] = [];

export function categoriaPaisaje(
  code: number | null,
  isDay: boolean | null,
): CategoriaPaisaje | null {
  const kind = clasificarAmbiente(code, isDay);
  if (kind === "neutral") return null;
  if (code !== null && [71, 73, 75, 77, 85, 86].includes(code)) {
    return isDay ? "snowDay" : "snowNight";
  }
  if (isDay === false && ["drizzle", "rain", "storm"].includes(kind)) return "rainNight";
  const categories = {
    sunny: "sunny",
    "partly-cloudy": "partlyCloudy",
    cloudy: "cloudy",
    drizzle: "drizzle",
    rain: "rain",
    storm: "storm",
    "clear-night": "clearNight",
    "cloudy-night": "cloudyNight",
  } as const;
  return categories[kind];
}

export function opcionesPaisaje(code: number | null, isDay: boolean | null): readonly string[] {
  const category = categoriaPaisaje(code, isDay);
  return category ? paisajes[category] : sinPaisajes;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  }
  return result >>> 0;
}

export function paisajeMeteorologico(
  city: IdentidadPaisaje,
  code: number | null,
  isDay: boolean | null,
): string | null {
  const kind = clasificarAmbiente(code, isDay);
  if (kind === "neutral") return null;
  const options = opcionesPaisaje(code, isDay);
  const identity = `${city.id}:${city.latitud}:${city.longitud}:${kind}:${isDay}`;
  return options[hash(identity) % options.length];
}

export type EntradaPaisaje = {
  id: number;
  verificada: FotoCiudad | null;
  ambientales: readonly FotoCiudad[];
  locales: readonly string[];
};

export type PaisajeAsignado = {
  foto: FotoCiudad | null;
  paisaje: string | null;
  ilustrativo: boolean;
};

function claveImagen(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

// Un emparejamiento permite desplazar una asignación previa si otra ciudad
// tiene menos alternativas; así se usan todas las imágenes distintas posibles.
function emparejar<T>(
  entries: readonly EntradaPaisaje[],
  options: (entry: EntradaPaisaje) => readonly T[],
  key: (option: T) => string,
  used: ReadonlySet<string>,
  initial: ReadonlyMap<number, T> = new Map(),
  priority: (option: T) => number = () => 0,
): Map<number, T> {
  const owners = new Map<string, number>();
  const assigned = new Map(initial);
  const byId = new Map(entries.map((entry) => [entry.id, entry]));
  const candidates = new Map(
    entries.map((entry) => [
      entry.id,
      options(entry)
        .map((option) => {
          const candidateKey = key(option);
          return {
            option,
            key: candidateKey,
            priority: priority(option),
            rank: hash(`${entry.id}:${candidateKey}`),
          };
        })
        .sort((a, b) => a.priority - b.priority || a.rank - b.rank || a.key.localeCompare(b.key)),
    ]),
  );
  for (const [id, option] of initial) owners.set(key(option), id);

  function assign(entry: EntradaPaisaje, visited: Set<string>): boolean {
    for (const candidate of candidates.get(entry.id) ?? []) {
      const candidateKey = candidate.key;
      if (used.has(candidateKey) || visited.has(candidateKey)) continue;
      visited.add(candidateKey);
      const owner = owners.get(candidateKey);
      if (owner === undefined || assign(byId.get(owner)!, visited)) {
        owners.set(candidateKey, entry.id);
        assigned.set(entry.id, candidate.option);
        return true;
      }
    }
    return false;
  }

  for (const entry of entries) {
    if (!assigned.has(entry.id)) assign(entry, new Set());
  }
  return assigned;
}

export function asignarPaisajes(
  entries: readonly EntradaPaisaje[],
): Record<number, PaisajeAsignado> {
  const ordered = [...entries].sort((a, b) => a.id - b.id);
  const result: Record<number, PaisajeAsignado> = {};
  const used = new Set<string>();

  for (const entry of ordered) {
    if (!entry.verificada) continue;
    const key = claveImagen(entry.verificada.url);
    if (used.has(key)) continue;
    used.add(key);
    result[entry.id] = { foto: entry.verificada, paisaje: null, ilustrativo: false };
  }

  const pending = ordered.filter((entry) => !result[entry.id]);
  const photos = emparejar(
    pending,
    (entry) => entry.ambientales,
    (photo) => claveImagen(photo.url),
    used,
  );
  type Alternativa = { foto: FotoCiudad | null; paisaje: string | null };
  const initial = new Map<number, Alternativa>(
    [...photos].map(([id, foto]) => [id, { foto, paisaje: null }]),
  );
  const alternatives = emparejar(
    pending,
    (entry): Alternativa[] => [
      ...entry.locales.map((paisaje) => ({ foto: null, paisaje })),
      ...entry.ambientales.map((foto) => ({ foto, paisaje: null })),
    ],
    (option) => claveImagen(option.foto?.url ?? option.paisaje ?? ""),
    used,
    initial,
    (option) => (option.paisaje ? 0 : 1),
  );
  for (const [id, selection] of alternatives) {
    result[id] = { ...selection, ilustrativo: true };
  }

  for (const entry of ordered) {
    if (result[entry.id]) continue;
    const foto =
      entry.verificada ??
      entry.ambientales[hash(String(entry.id)) % entry.ambientales.length] ??
      null;
    const paisaje = foto
      ? null
      : (entry.locales[hash(String(entry.id)) % entry.locales.length] ?? null);
    result[entry.id] = { foto, paisaje, ilustrativo: !entry.verificada };
  }
  return result;
}

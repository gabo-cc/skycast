import {
  fotoAmbiental,
  fotoVerificada,
  type FotoCiudad,
  type IdentidadCiudad,
} from "./city-photo.ts";

const HORA = 60 * 60 * 1000;
const cache = new Map<string, { value: FotoCiudad | null; expires: number }>();
const pendientes = new Map<string, Promise<FotoCiudad | null>>();
const cacheAmbiental = new Map<CategoriaAmbiental, { value: FotoCiudad[]; expires: number }>();
const pendientesAmbientales = new Map<CategoriaAmbiental, Promise<FotoCiudad[]>>();
const llamadas: number[] = [];
let activas = 0;
const espera: (() => void)[] = [];

const consultasAmbientales = {
  sunny: "sunny landscape clear blue sky nature",
  partlyCloudy: "landscape partly cloudy sky nature",
  cloudy: "overcast cloudy landscape nature",
  drizzle: "misty drizzle landscape forest",
  rain: "rainy landscape forest rain",
  storm: "stormy sky dramatic landscape",
  clearNight: "clear night stars landscape",
  cloudyNight: "cloudy night sky landscape",
  rainNight: "rainy night landscape",
  snowDay: "snowy winter landscape mountains",
  snowNight: "snowy night landscape",
} as const;

export type CategoriaAmbiental = keyof typeof consultasAmbientales;

export function esCategoriaAmbiental(value: string): value is CategoriaAmbiental {
  return Object.hasOwn(consultasAmbientales, value);
}

async function limitar<T>(task: () => Promise<T>): Promise<T> {
  if (activas >= 2) await new Promise<void>((resolve) => espera.push(resolve));
  else activas += 1;
  try {
    return await task();
  } finally {
    const siguiente = espera.shift();
    if (siguiente) siguiente();
    else activas -= 1;
  }
}

async function consultar(url: URL, key: string): Promise<unknown> {
  const now = Date.now();
  while (llamadas.length && llamadas[0] <= now - HORA) llamadas.shift();
  if (llamadas.length >= 40) throw new Error("Límite de consultas alcanzado");
  llamadas.push(now);
  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
    signal: AbortSignal.timeout(6000),
    next: { revalidate: 86400 },
  });
  if (!response.ok) throw new Error("Fotografías no disponibles");
  return response.json();
}

async function buscar(city: IdentidadCiudad, key: string): Promise<FotoCiudad | null> {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.search = new URLSearchParams({
    query: [city.nombre, city.region, city.pais].filter(Boolean).join(", "),
    per_page: "3",
    orientation: "landscape",
    content_filter: "high",
  }).toString();
  const response = await consultar(url, key);
  if (
    !response ||
    typeof response !== "object" ||
    !("results" in response) ||
    !Array.isArray(response.results)
  )
    return null;
  for (const item of response.results.slice(0, 3)) {
    const id: unknown = item && typeof item === "object" ? item.id : null;
    if (typeof id !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(id)) continue;
    const detail = await consultar(new URL(`https://api.unsplash.com/photos/${id}`), key);
    const photo = fotoVerificada(detail, city);
    if (photo) return photo;
  }
  return null;
}

export function obtenerFotoCiudad(
  city: IdentidadCiudad,
  key: string | undefined,
): Promise<FotoCiudad | null> {
  if (!key || !city.pais) return Promise.resolve(null);
  const cacheKey = JSON.stringify([
    city.nombre,
    city.region,
    city.pais,
    city.latitud,
    city.longitud,
  ]);
  const saved = cache.get(cacheKey);
  if (saved && saved.expires > Date.now()) return Promise.resolve(saved.value);
  const pending = pendientes.get(cacheKey);
  if (pending) return pending;
  if (pendientes.size >= 50) return Promise.resolve(null);
  const request = limitar(() => buscar(city, key))
    .catch(() => null)
    .then((value) => {
      if (cache.size >= 256) cache.delete(cache.keys().next().value as string);
      cache.set(cacheKey, { value, expires: Date.now() + (value ? 24 * HORA : HORA / 12) });
      return value;
    })
    .finally(() => pendientes.delete(cacheKey));
  pendientes.set(cacheKey, request);
  return request;
}

async function buscarAmbiente(categoria: CategoriaAmbiental, key: string): Promise<FotoCiudad[]> {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.search = new URLSearchParams({
    query: consultasAmbientales[categoria],
    per_page: "30",
    orientation: "landscape",
    content_filter: "high",
  }).toString();
  const response = await consultar(url, key);
  if (
    !response ||
    typeof response !== "object" ||
    !("results" in response) ||
    !Array.isArray(response.results)
  )
    return [];

  const fotos: FotoCiudad[] = [];
  const urls = new Set<string>();
  for (const item of response.results.slice(0, 30)) {
    const foto = fotoAmbiental(item);
    if (!foto) continue;
    const identity = new URL(foto.url).pathname;
    if (urls.has(identity)) continue;
    urls.add(identity);
    fotos.push(foto);
  }
  return fotos;
}

export function obtenerFotosAmbientales(
  categoria: CategoriaAmbiental,
  key: string | undefined,
): Promise<FotoCiudad[]> {
  if (!key || !esCategoriaAmbiental(categoria)) return Promise.resolve([]);
  const saved = cacheAmbiental.get(categoria);
  if (saved && saved.expires > Date.now()) return Promise.resolve(saved.value);
  const pending = pendientesAmbientales.get(categoria);
  if (pending) return pending;
  const request = limitar(() => buscarAmbiente(categoria, key))
    .catch((): FotoCiudad[] => [])
    .then((value) => {
      cacheAmbiental.set(categoria, {
        value,
        expires: Date.now() + (value.length ? 24 * HORA : HORA / 12),
      });
      return value;
    })
    .finally(() => pendientesAmbientales.delete(categoria));
  pendientesAmbientales.set(categoria, request);
  return request;
}

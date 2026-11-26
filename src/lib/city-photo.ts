import type { Ciudad } from "./open-meteo/types.ts";

export type FotoCiudad = {
  url: string;
  fotografo: string;
  perfil: string;
};

export type IdentidadCiudad = Pick<Ciudad, "nombre" | "pais" | "region" | "latitud" | "longitud">;

function normalizar(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en")
    .trim();
}

function objeto(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function urlSegura(value: unknown, host: string): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === host && !url.username && !url.password
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

// Los paisajes no se presentan como vistas de una ubicación determinada.
export function fotoAmbiental(value: unknown): FotoCiudad | null {
  const photo = objeto(value);
  const user = objeto(photo?.user);
  const userLinks = objeto(user?.links);
  const urls = objeto(photo?.urls);
  const url =
    urlSegura(urls?.regular, "images.unsplash.com") ??
    urlSegura(urls?.small, "images.unsplash.com");
  const perfil = urlSegura(userLinks?.html, "unsplash.com");
  const fotografo = typeof user?.name === "string" ? user.name.trim() : "";
  if (!url || !perfil || !fotografo || fotografo.length > 100) return null;
  const profile = new URL(perfil);
  profile.searchParams.set("utm_source", "skycast");
  profile.searchParams.set("utm_medium", "referral");
  return { url, perfil: profile.toString(), fotografo };
}

function distanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, a)));
}

// Un resultado de búsqueda no confirma por sí solo dónde se tomó la imagen.
export function fotoVerificada(value: unknown, city: IdentidadCiudad): FotoCiudad | null {
  const photo = objeto(value);
  const location = objeto(photo?.location);
  if (!city.pais || !location) return null;
  const nombreCiudad = normalizar(city.nombre);
  const nombrePais = normalizar(city.pais);

  const parts = typeof location.name === "string" ? location.name.split(",").map(normalizar) : [];
  const sameCity =
    typeof location.city === "string"
      ? normalizar(location.city) === nombreCiudad
      : parts.includes(nombreCiudad);
  const sameCountry =
    typeof location.country === "string"
      ? normalizar(location.country) === nombrePais
      : parts.includes(nombrePais);
  if (!sameCity || !sameCountry) return null;

  const position = objeto(location.position);
  const lat = position?.latitude;
  const lon = position?.longitude;
  const hasCoordinates = typeof lat === "number" && typeof lon === "number";
  if (
    hasCoordinates &&
    (!Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      Math.abs(lat) > 90 ||
      Math.abs(lon) > 180 ||
      distanciaKm(city.latitud, city.longitud, lat, lon) > 50)
  )
    return null;
  if (city.region) {
    const additionalPlaces = parts.filter((part) => part !== nombreCiudad && part !== nombrePais);
    if (
      !additionalPlaces.includes(normalizar(city.region)) &&
      (additionalPlaces.length > 0 || !hasCoordinates)
    )
      return null;
  }

  return fotoAmbiental(value);
}

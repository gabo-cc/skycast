import type { Ciudad } from "./open-meteo/types.ts";

export const FAVORITES_KEY = "skycast:favoritos";
const VERSION = 1;

export class FavoritesError extends Error {}

function validCity(value: unknown): value is Ciudad {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const city = value as Record<string, unknown>;
  const optionalText = (item: unknown) =>
    item === null || (typeof item === "string" && item.trim().length > 0 && item.length <= 100);
  return (
    Number.isSafeInteger(city.id) &&
    (city.id as number) > 0 &&
    typeof city.nombre === "string" &&
    city.nombre.trim().length > 0 &&
    city.nombre.length <= 100 &&
    optionalText(city.pais) &&
    optionalText(city.region) &&
    typeof city.latitud === "number" &&
    Number.isFinite(city.latitud) &&
    city.latitud >= -90 &&
    city.latitud <= 90 &&
    typeof city.longitud === "number" &&
    Number.isFinite(city.longitud) &&
    city.longitud >= -180 &&
    city.longitud <= 180
  );
}

export function leerFavoritos(storage: Pick<Storage, "getItem">): Ciudad[] {
  try {
    const raw = storage.getItem(FAVORITES_KEY);
    if (raw === null) return [];
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error();
    const record = data as Record<string, unknown>;
    if (
      record.version !== VERSION ||
      !Array.isArray(record.ciudades) ||
      !record.ciudades.every(validCity)
    )
      throw new Error();
    const cities = record.ciudades as Ciudad[];
    if (new Set(cities.map((city) => city.id)).size !== cities.length) throw new Error();
    return cities.map(({ id, nombre, pais, region, latitud, longitud }) => ({
      id,
      nombre,
      pais,
      region,
      latitud,
      longitud,
    }));
  } catch {
    throw new FavoritesError(
      "No se pudieron leer los favoritos. Comprueba el almacenamiento del navegador.",
    );
  }
}

export function actualizarFavoritos(
  storage: Pick<Storage, "getItem" | "setItem">,
  city: Ciudad,
  action: "agregar" | "eliminar",
): Ciudad[] {
  const current = leerFavoritos(storage);
  if (!validCity(city))
    throw new FavoritesError("La ciudad no tiene datos válidos para guardarse.");
  const exists = current.some((item) => item.id === city.id);
  if ((action === "agregar" && exists) || (action === "eliminar" && !exists)) return current;
  const next =
    action === "agregar" ? [...current, city] : current.filter((item) => item.id !== city.id);
  try {
    storage.setItem(FAVORITES_KEY, JSON.stringify({ version: VERSION, ciudades: next }));
  } catch {
    throw new FavoritesError(
      "No se pudieron guardar los favoritos. Comprueba el almacenamiento del navegador.",
    );
  }
  return next;
}

export function esEventoFavoritos(key: string | null): boolean {
  return key === FAVORITES_KEY || key === null;
}

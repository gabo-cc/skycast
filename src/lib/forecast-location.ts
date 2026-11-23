import type { Ciudad } from "./open-meteo/types.ts";
import { validarCoordenadas } from "./open-meteo/validation.ts";

export const DEFAULT_LOCATION = {
  id: 0,
  nombre: "San Salvador",
  pais: "El Salvador",
  region: null,
  latitud: 13.6929,
  longitud: -89.2182,
} satisfies Ciudad;
export function forecastUrl(city: Ciudad): string {
  const params = new URLSearchParams({
    latitud: String(city.latitud),
    longitud: String(city.longitud),
    id: String(city.id),
    nombre: city.nombre,
  });
  if (city.pais) params.set("pais", city.pais);
  if (city.region) params.set("region", city.region);
  return `/pronostico?${params}`;
}
export function parseLocation(params: URLSearchParams): Ciudad | null {
  if (![...params.keys()].length) return DEFAULT_LOCATION;
  try {
    const coords = validarCoordenadas(params);
    const single = (key: string) =>
      params.getAll(key).length <= 1 ? params.get(key)?.trim() || null : null;
    const name = single("nombre");
    const id = single("id");
    if (["nombre", "id", "pais", "region"].some((key) => params.getAll(key).length > 1))
      return null;
    if (
      (name && name.length > 100) ||
      (id && (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)))) ||
      [single("pais"), single("region")].some((value) => value && value.length > 100)
    )
      return null;
    return {
      ...coords,
      id: id ? Number(id) : 0,
      nombre: name || "Ubicación seleccionada",
      pais: single("pais"),
      region: single("region"),
    };
  } catch {
    return null;
  }
}

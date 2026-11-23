import { ApiError } from "./errors.ts";
import { transformarCiudades, transformarClima } from "./transform.ts";

const TIMEOUT_MS = 8000;

async function consultar(url: URL): Promise<unknown> {
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal, cache: "no-store" });
    if (!response.ok) throw new ApiError(502, "El proveedor meteorológico rechazó la solicitud.");
    try {
      return await response.json();
    } catch (error) {
      if (signal.aborted) throw error;
      throw new ApiError(502, "El proveedor devolvió una respuesta inválida.");
    }
  } catch (error) {
    if (signal.aborted)
      throw new ApiError(504, "La consulta al proveedor agotó el tiempo de espera.");
    if (error instanceof ApiError) throw error;
    throw new ApiError(503, "El proveedor meteorológico no está disponible.");
  }
}

export async function buscarCiudades(nombre: string) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({
    name: nombre,
    count: "10",
    language: "es",
    format: "json",
  }).toString();
  return transformarCiudades(await consultar(url));
}

export async function obtenerClima(latitud: number, longitud: number) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(latitud),
    longitude: String(longitud),
    timezone: "auto",
    forecast_days: "7",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
    hourly: "temperature_2m,precipitation_probability,weather_code",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
  }).toString();
  return transformarClima(await consultar(url));
}

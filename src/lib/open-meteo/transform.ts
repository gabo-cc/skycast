import { ApiError } from "./errors.ts";
import type { Ciudad, Clima } from "./types.ts";

function invalid(): never {
  throw new ApiError(502, "El proveedor devolvió datos inesperados.");
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return invalid();
  return value as Record<string, unknown>;
}
function text(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return invalid();
  return value;
}
function number(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return invalid();
  return value;
}
function optionalNumber(value: unknown): number | null {
  return value == null ? null : number(value);
}
function optionalText(value: unknown): string | null {
  return value == null ? null : text(value);
}
function series(source: Record<string, unknown>, key: string, length: number): (number | null)[] {
  const value = source[key];
  if (value == null) return Array.from({ length }, () => null);
  if (!Array.isArray(value) || value.length !== length) return invalid();
  return value.map(optionalNumber);
}
function times(source: Record<string, unknown>): number[] {
  if (!Array.isArray(source.time)) return invalid();
  return source.time.map(number);
}
function instant(value: unknown): string {
  const milliseconds = number(value) * 1000;
  const date = new Date(milliseconds);
  if (!Number.isFinite(date.getTime())) return invalid();
  return date.toISOString();
}
function dailyDate(value: number, offset: number): string {
  // Open-Meteo define las fechas diarias con el desplazamiento fijo de la respuesta.
  return instant(value + offset).slice(0, 10);
}

export function transformarCiudades(data: unknown): Ciudad[] {
  const results = object(data).results;
  if (results == null) return [];
  if (!Array.isArray(results)) return invalid();
  return results.map((item) => {
    const city = object(item);
    const latitud = number(city.latitude);
    const longitud = number(city.longitude);
    if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) return invalid();
    return {
      id: number(city.id),
      nombre: text(city.name),
      pais: optionalText(city.country),
      region: optionalText(city.admin1),
      latitud,
      longitud,
    };
  });
}

export function transformarClima(data: unknown): Clima {
  const root = object(data);
  const timezone = text(root.timezone);
  try {
    new Intl.DateTimeFormat("es", { timeZone: timezone });
  } catch {
    return invalid();
  }
  const offset = number(root.utc_offset_seconds);
  const hourly = object(root.hourly);
  const daily = object(root.daily);
  const hourTimes = times(hourly);
  const dayTimes = times(daily);
  const temperatures = series(hourly, "temperature_2m", hourTimes.length);
  const precipitation = series(hourly, "precipitation_probability", hourTimes.length);
  const hourCodes = series(hourly, "weather_code", hourTimes.length);
  const highs = series(daily, "temperature_2m_max", dayTimes.length);
  const lows = series(daily, "temperature_2m_min", dayTimes.length);
  const dayPrecipitation = series(daily, "precipitation_probability_max", dayTimes.length);
  const dayCodes = series(daily, "weather_code", dayTimes.length);
  const current = root.current == null ? null : object(root.current);
  const dayValue = current ? optionalNumber(current.is_day) : null;
  if (dayValue !== null && dayValue !== 0 && dayValue !== 1) return invalid();
  return {
    zonaHoraria: timezone,
    desfaseUtcSegundos: offset,
    unidades: { temperatura: "°C", viento: "km/h", humedad: "%", precipitacion: "%" },
    actual: current
      ? {
          hora: current.time == null ? null : instant(current.time),
          temperatura: optionalNumber(current.temperature_2m),
          sensacionTermica: optionalNumber(current.apparent_temperature),
          humedad: optionalNumber(current.relative_humidity_2m),
          viento: optionalNumber(current.wind_speed_10m),
          codigoMeteorologico: optionalNumber(current.weather_code),
          esDeDia: dayValue === null ? null : dayValue === 1,
        }
      : null,
    horas: hourTimes
      .map((hora, index) => ({
        hora: instant(hora),
        temperatura: temperatures[index],
        probabilidadPrecipitacion: precipitation[index],
        codigoMeteorologico: hourCodes[index],
      }))
      .sort((a, b) => Date.parse(a.hora) - Date.parse(b.hora)),
    dias: dayTimes.map((fecha, index) => ({
      fecha: dailyDate(fecha, offset),
      temperaturaMaxima: highs[index],
      temperaturaMinima: lows[index],
      probabilidadPrecipitacionMaxima: dayPrecipitation[index],
      codigoMeteorologico: dayCodes[index],
    })),
  };
}

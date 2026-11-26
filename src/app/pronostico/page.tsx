import type { Metadata } from "next";
import Link from "next/link";
import { CurrentWeather } from "@/components/weather-view";
import { ForecastInteractive } from "@/components/forecast-interactive";
import { parseLocation } from "@/lib/forecast-location";
import { obtenerClima } from "@/lib/open-meteo/service";

export const metadata: Metadata = { title: "Pronóstico" };
export default async function PronosticoPage({ searchParams }: PageProps<"/pronostico">) {
  const input = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (value !== undefined) params.append(key, value);
  }
  const city = parseLocation(params);
  if (!city)
    return (
      <div className="space-y-5 pt-12">
        <h1 className="text-3xl font-semibold">Ubicación no válida</h1>
        <p>Comprueba las coordenadas o selecciona una ciudad.</p>
        <Link
          href="/buscar"
          className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white"
        >
          Buscar ciudades
        </Link>
      </div>
    );
  const weather = await obtenerClima(city.latitud, city.longitud);
  return (
    <div className="space-y-6 pt-6 sm:pt-8">
      <div>
        <Link href="/buscar" className="text-sm font-semibold text-[var(--accent)] hover:underline">
          ← Buscar otra ciudad
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--ink)]">
          {city.nombre}
          {city.pais ? `, ${city.pais}` : ""}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Condiciones y pronóstico de tu ubicación.
        </p>
      </div>
      <CurrentWeather city={city} weather={weather} />
      <ForecastInteractive weather={weather} />
      <p className="text-xs leading-5 text-[var(--muted)]">
        Fuente: Open-Meteo. Los valores diarios usan el desplazamiento vigente al consultar y pueden
        abarcar horas distintas del día local durante un cambio de horario de verano.
      </p>
    </div>
  );
}

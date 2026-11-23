import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/ui";
import { CurrentWeather, DailyForecast, HourlyForecast } from "@/components/weather-view";
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
    <div className="space-y-10 pt-12 sm:pt-16">
      <PageIntro
        eyebrow="Planea con calma"
        title="El cielo que viene"
        description="Consulta las condiciones y el pronóstico para tu ubicación."
      />
      <CurrentWeather city={city} weather={weather} />
      <HourlyForecast weather={weather} />
      <DailyForecast weather={weather} />
      <p className="text-xs leading-5 text-slate-600">
        Fuente: Open-Meteo. Los valores diarios usan el desplazamiento vigente al consultar y pueden
        abarcar horas distintas del día local durante un cambio de horario de verano.
      </p>
    </div>
  );
}

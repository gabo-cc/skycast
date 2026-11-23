import Link from "next/link";
import { CurrentWeather, DailyForecast } from "@/components/weather-view";
import { DEFAULT_LOCATION } from "@/lib/forecast-location";
import { obtenerClima } from "@/lib/open-meteo/service";

export default async function Home() {
  const weather = await obtenerClima(DEFAULT_LOCATION.latitud, DEFAULT_LOCATION.longitud);
  return (
    <div className="space-y-10 pt-10 sm:pt-14">
      <section className="grid gap-8 rounded-[2rem] bg-[#dceef6] px-6 py-10 sm:px-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold tracking-widest text-sky-800 uppercase">
            Una mirada al cielo
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
            Tu cielo,
            <br />
            <span className="text-sky-700">más claro.</span>
          </h1>
          <p className="mt-5 max-w-md leading-7 text-slate-700">
            Consulta las condiciones y prepara tus próximos días.
          </p>
          <Link
            href="/buscar"
            className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Explorar ciudades
          </Link>
        </div>
        <CurrentWeather city={DEFAULT_LOCATION} weather={weather} />
      </section>
      <DailyForecast weather={weather} limit={3} />
      <Link
        href="/pronostico"
        className="inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-sky-800"
      >
        Ver pronóstico completo
      </Link>
      <p className="text-xs leading-5 text-slate-600">
        Fuente: Open-Meteo. Los valores diarios usan el desplazamiento vigente al consultar y pueden
        abarcar horas distintas del día local durante un cambio de horario de verano.
      </p>
    </div>
  );
}

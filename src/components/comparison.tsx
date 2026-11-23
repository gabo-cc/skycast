"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ComparisonSelector } from "@/components/comparison-selector";
import { Icon } from "@/components/icon";
import { useFavorites } from "@/hooks/use-favorites";
import {
  consultarClima,
  datosDelDia,
  diferencia,
  intercambiar,
  seleccionarCiudad,
  type ClimaComparable,
} from "@/lib/comparison";
import { forecastUrl } from "@/lib/forecast-location";
import type { Ciudad } from "@/lib/open-meteo/types";
import { condicion, fechaLocal, instanteLocal, valor } from "@/lib/weather-display";

type WeatherState =
  { status: "loading" } | { status: "error" } | { status: "ready"; weather: ClimaComparable };

function WeatherPanel({
  city,
  onResult,
}: {
  city: Ciudad;
  onResult: (id: number, weather: ClimaComparable | null) => void;
}) {
  const [state, setState] = useState<WeatherState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    consultarClima(city, controller.signal)
      .then((weather) => {
        if (active) {
          setState({ status: "ready", weather });
          onResult(city.id, weather);
        }
      })
      .catch(() => {
        if (active && !controller.signal.aborted) {
          setState({ status: "error" });
          onResult(city.id, null);
        }
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [city, attempt, onResult]);
  const location = [city.region, city.pais].filter(Boolean).join(", ") || "Ubicación no disponible";
  return (
    <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6">
      <h3 className="text-xl font-semibold break-words text-slate-900">{city.nombre}</h3>
      <p className="mt-1 text-sm break-words text-slate-600">{location}</p>
      {state.status === "loading" && (
        <p role="status" className="mt-5 text-sm text-slate-600">
          Consultando el clima…
        </p>
      )}
      {state.status === "error" && (
        <div role="alert" className="mt-5 text-sm text-slate-700">
          <p>No se pudo consultar el clima de esta ciudad.</p>
          <button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              onResult(city.id, null);
              setAttempt((value) => value + 1);
            }}
            className="mt-2 min-h-11 font-semibold text-sky-800 underline"
          >
            Reintentar
          </button>
        </div>
      )}
      {state.status === "ready" && <WeatherMetrics weather={state.weather} />}
      <Link
        href={forecastUrl(city)}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-sky-800"
      >
        Ver pronóstico <Icon name="arrow" className="size-4" />
      </Link>
    </article>
  );
}

function WeatherMetrics({ weather }: { weather: ClimaComparable }) {
  const current = weather.actual;
  const daily = datosDelDia(weather);
  const condition = condicion(current?.codigoMeteorologico ?? null, current?.esDeDia ?? null);
  const metrics = [
    ["Temperatura", valor(current?.temperatura ?? null, "°C")],
    ["Sensación térmica", valor(current?.sensacionTermica ?? null, "°C")],
    ["Humedad", valor(current?.humedad ?? null, "%")],
    ["Viento", valor(current?.viento ?? null, " km/h")],
    ["Condición", condition.descripcion],
    ["Máxima del día", valor(daily?.temperaturaMaxima ?? null, "°C")],
    ["Mínima del día", valor(daily?.temperaturaMinima ?? null, "°C")],
    [
      "Probabilidad máxima de precipitación",
      valor(daily?.probabilidadPrecipitacionMaxima ?? null, "%"),
    ],
  ];
  return (
    <>
      <p className="mt-4 text-xs leading-5 text-slate-600">
        Hora del dato: {instanteLocal(current?.hora ?? null, weather.zonaHoraria)} ·{" "}
        {weather.zonaHoraria}
      </p>
      <p className="mt-1 text-xs text-slate-600">
        Fecha del pronóstico diario: {fechaLocal(daily?.fecha ?? null)}
      </p>
      <dl className="mt-4 divide-y divide-slate-100">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-sm"
          >
            <dt className="text-slate-600">{label}</dt>
            <dd className="font-semibold text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

export function Comparison() {
  const [cities, setCities] = useState<[Ciudad | null, Ciudad | null]>([null, null]);
  const [weather, setWeather] = useState<Record<number, ClimaComparable | null>>({});
  const [error, setError] = useState<string | null>(null);
  const favorites = useFavorites();
  const handleWeather = useCallback((id: number, result: ClimaComparable | null) => {
    setWeather((previous) => ({ ...previous, [id]: result }));
  }, []);
  function choose(index: 0 | 1, city: Ciudad) {
    if (cities[index]?.id === city.id) {
      setError(null);
      return;
    }
    const next = seleccionarCiudad(cities, index, city);
    if (!next) {
      setError("Selecciona dos ciudades diferentes.");
      return;
    }
    if (cities[index]?.id !== city.id) setWeather((previous) => ({ ...previous, [city.id]: null }));
    setError(null);
    setCities(next);
  }
  const both = cities[0] && cities[1];
  const diff = both
    ? diferencia(
        weather[cities[0]!.id]?.actual?.temperatura,
        weather[cities[1]!.id]?.actual?.temperatura,
      )
    : null;
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <ComparisonSelector
          label="Primera ciudad"
          city={cities[0]}
          otherId={cities[1]?.id}
          favorites={favorites.cities}
          onSelect={(city) => choose(0, city)}
        />
        <ComparisonSelector
          label="Segunda ciudad"
          city={cities[1]}
          otherId={cities[0]?.id}
          favorites={favorites.cities}
          onSelect={(city) => choose(1, city)}
        />
      </div>
      {favorites.status === "error" && (
        <p className="text-sm text-slate-600">
          No se pudieron cargar los favoritos; puedes buscar ciudades igualmente.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-800">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={!both}
        onClick={() => setCities(intercambiar(cities))}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon name="compare" className="size-4" /> Intercambiar ciudades
      </button>
      {both ? (
        <section className="space-y-4" aria-labelledby="comparacion-titulo">
          <h2 id="comparacion-titulo" className="text-xl font-semibold">
            Comparación actual
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {cities.map(
              (city) => city && <WeatherPanel key={city.id} city={city} onResult={handleWeather} />,
            )}
          </div>
          {diff !== null && (
            <p className="rounded-xl bg-sky-50 p-4 text-sm text-sky-950">
              Diferencia de temperatura ({cities[0]?.nombre} menos {cities[1]?.nombre}):{" "}
              {diff > 0 ? "+" : ""}
              {diff} °C.
            </p>
          )}
          <p className="text-xs leading-5 text-slate-600">
            Las horas corresponden a la hora del dato en cada ciudad. Los agregados diarios de
            Open-Meteo pueden abarcar horas distintas del día local durante cambios de horario de
            verano.
          </p>
        </section>
      ) : (
        <p role="status" className="text-sm text-slate-600">
          Selecciona dos ciudades distintas para comparar sus condiciones.
        </p>
      )}
    </div>
  );
}

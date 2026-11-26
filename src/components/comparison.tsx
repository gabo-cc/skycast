"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ComparisonSelector } from "@/components/comparison-selector";
import { CityPhotoBackground, CityPhotoCredit } from "@/components/city-photo";
import { ScenePhotoProvider, useScenePhoto } from "@/components/scene-photos";
import { WeatherAtmosphere } from "@/components/weather-atmosphere";
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
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "ready";
      weather: ClimaComparable;
    };

function locationLabel(city: Ciudad): string {
  return [city.region, city.pais].filter(Boolean).join(", ") || "Ubicación no disponible";
}

function WeatherMetric({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex min-h-10 flex-wrap items-center justify-between gap-x-2 gap-y-0.5 border-b py-2 last:border-b-0"
      style={{ borderColor: "var(--line)" }}
    >
      <dt className="text-sm" style={{ color: "var(--muted)" }}>
        {label}
      </dt>

      <dd className="text-right text-sm font-bold tabular-nums" style={{ color: "var(--ink)" }}>
        {value}
      </dd>
    </div>
  );
}

function WeatherMetrics({ weather }: { weather: ClimaComparable }) {
  const current = weather.actual;
  const daily = datosDelDia(weather);

  const condition = condicion(current?.codigoMeteorologico ?? null, current?.esDeDia ?? null);

  const metrics = [
    {
      label: "Sensación térmica",
      value: valor(current?.sensacionTermica ?? null, "°C"),
    },
    {
      label: "Humedad",
      value: valor(current?.humedad ?? null, "%"),
    },
    {
      label: "Viento",
      value: valor(current?.viento ?? null, " km/h"),
    },
    {
      label: "Máxima del día",
      value: valor(daily?.temperaturaMaxima ?? null, "°C"),
    },
    {
      label: "Mínima del día",
      value: valor(daily?.temperaturaMinima ?? null, "°C"),
    },
    {
      label: "Precipitación máxima",
      value: valor(daily?.probabilidadPrecipitacionMaxima ?? null, "%"),
    },
  ];

  return (
    <>
      <dl className="grid grid-cols-2 gap-x-4">
        {metrics.map((metric) => (
          <WeatherMetric key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </dl>

      <div
        className="mt-2 rounded-xl px-3 py-2 text-xs leading-5"
        style={{
          background: "var(--surface-soft)",
          color: "var(--muted)",
        }}
      >
        <p>
          <span className="font-semibold">Condición:</span> {condition.descripcion}
        </p>

        <p className="mt-1">
          Fecha local del pronóstico diario: {fechaLocal(daily?.fecha ?? null)}
        </p>
      </div>
    </>
  );
}

function WeatherPanel({
  city,
  onResult,
}: {
  city: Ciudad;
  onResult: (id: number, weather: ClimaComparable | null) => void;
}) {
  const [state, setState] = useState<WeatherState>({
    status: "loading",
  });

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    consultarClima(city, controller.signal)
      .then((weather) => {
        if (!active) return;

        setState({
          status: "ready",
          weather,
        });

        onResult(city.id, weather);
      })
      .catch(() => {
        if (!active || controller.signal.aborted) {
          return;
        }

        setState({ status: "error" });
        onResult(city.id, null);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [city, attempt, onResult]);

  const current = state.status === "ready" ? state.weather.actual : null;
  const cityPhoto = useScenePhoto(
    city,
    current?.codigoMeteorologico ?? null,
    current?.esDeDia ?? null,
  );

  const condition = condicion(current?.codigoMeteorologico ?? null, current?.esDeDia ?? null);

  function retry() {
    setState({ status: "loading" });
    onResult(city.id, null);
    setAttempt((value) => value + 1);
  }

  return (
    <article
      className="comparison-weather-panel flex min-w-0 flex-col overflow-hidden rounded-[26px] border shadow-sm"
      style={{
        background: "var(--surface)",
        borderColor: "var(--line)",
      }}
    >
      {/* Paisaje meteorológico */}

      <div className="atmosphere-container min-h-56 sm:min-h-60">
        <WeatherAtmosphere
          code={current?.codigoMeteorologico ?? null}
          isDay={current?.esDeDia ?? null}
          city={city}
          landscape={cityPhoto.landscape}
        >
          {cityPhoto.photo && (
            <CityPhotoBackground
              photo={cityPhoto.photo}
              loaded={cityPhoto.loaded}
              onLoad={cityPhoto.onLoad}
              onError={cityPhoto.onError}
            />
          )}
        </WeatherAtmosphere>

        <div className="atmosphere-content flex min-h-56 flex-col justify-between p-4 text-white sm:min-h-60 sm:p-5">
          <div>
            <p className="text-[11px] font-bold tracking-[0.13em] text-white/80 uppercase">
              EL TIEMPO EN
            </p>

            <h3 className="mt-1 text-2xl font-bold tracking-tight break-words text-white">
              {city.nombre}
            </h3>

            <p className="mt-1 text-sm leading-5 break-words text-white/85">
              {locationLabel(city)}
            </p>
            {(!cityPhoto.loaded || cityPhoto.illustrative) && (
              <p className="mt-1 text-xs text-white/85">Paisaje ilustrativo</p>
            )}
          </div>

          <div className="mt-3">
            {state.status === "ready" ? (
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-5xl font-bold tracking-[-0.07em] text-white tabular-nums">
                    {valor(current?.temperatura ?? null, "°C")}
                  </p>

                  <Icon name={condition.icono} className="size-9 shrink-0 text-white" />
                </div>

                <p className="mt-1 text-sm font-medium text-white/90">{condition.descripcion}</p>

                <p className="mt-2 text-[11px] leading-5 text-white/75">
                  Hora del dato: {instanteLocal(current?.hora ?? null, state.weather.zonaHoraria)}
                </p>
              </div>
            ) : state.status === "loading" ? (
              <div
                role="status"
                className="rounded-2xl border border-white/20 bg-black/20 p-4 text-sm text-white"
              >
                Consultando el clima de esta ciudad…
              </div>
            ) : (
              <div role="alert" className="rounded-2xl border border-white/20 bg-black/30 p-4">
                <p className="text-sm text-white">No se pudo consultar el clima.</p>

                <button
                  type="button"
                  onClick={retry}
                  className="mt-3 min-h-11 rounded-xl bg-white px-4 text-sm font-bold text-slate-900 transition-opacity hover:opacity-90"
                >
                  Reintentar consulta
                </button>
              </div>
            )}
            <CityPhotoCredit photo={cityPhoto.loaded ? cityPhoto.photo : null} />
          </div>
        </div>
      </div>

      {/* Métricas meteorológicas */}

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        {state.status === "ready" ? (
          <WeatherMetrics weather={state.weather} />
        ) : (
          <p className="text-sm leading-6" style={{ color: "var(--muted)" }}>
            {state.status === "loading"
              ? "Preparando las métricas meteorológicas…"
              : "Las métricas no están disponibles hasta recuperar la consulta."}
          </p>
        )}

        <Link
          href={forecastUrl(city)}
          className="group mt-auto flex min-h-11 items-center justify-between gap-3 rounded-xl px-4 text-sm font-semibold transition-colors hover:bg-[var(--surface-soft)]"
          style={{
            background: "var(--surface-soft)",
            color: "var(--accent)",
          }}
        >
          <span>Consultar pronóstico completo</span>

          <Icon
            name="arrow"
            className="size-5 shrink-0 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}

export function Comparison() {
  const [cities, setCities] = useState<[Ciudad | null, Ciudad | null]>([null, null]);

  const [weather, setWeather] = useState<Record<number, ClimaComparable | null>>({});

  const [error, setError] = useState<string | null>(null);

  const favorites = useFavorites();

  // Referencia a la sección de resultados.
  const resultsRef = useRef<HTMLElement>(null);

  // Solo desplazarnos cuando se selecciona una ciudad.
  const pendingScroll = useRef(false);
  const pendingSwap = useRef(false);

  useEffect(() => {
    if (!pendingSwap.current) return;
    pendingSwap.current = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    resultsRef.current
      ?.querySelectorAll<HTMLElement>(".comparison-weather-panel")
      .forEach((panel, index) => {
        panel.animate(
          [
            { opacity: 0.7, transform: `translateX(${index === 0 ? 12 : -12}px)` },
            { opacity: 1, transform: "translateX(0)" },
          ],
          { duration: 240, easing: "ease-out" },
        );
      });
  }, [cities]);

  useEffect(() => {
    if (!pendingScroll.current || !cities[0] || !cities[1]) {
      return;
    }

    pendingScroll.current = false;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    resultsRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [cities]);

  const handleWeather = useCallback((id: number, result: ClimaComparable | null) => {
    setWeather((previous) => ({
      ...previous,
      [id]: result,
    }));
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

    // Invalidar los datos de la ciudad sustituida.
    setWeather((previous) => ({
      ...previous,
      [city.id]: null,
    }));

    // Desplazar automáticamente cuando
    // ambas ciudades ya estén seleccionadas.
    pendingScroll.current = next[0] !== null && next[1] !== null;

    setError(null);
    setCities(next);
  }

  const first = cities[0];
  const second = cities[1];

  const both = first !== null && second !== null;

  const firstWeather = first ? weather[first.id] : null;

  const secondWeather = second ? weather[second.id] : null;

  const differences = [
    {
      label: "Temperatura",
      unit: "°C",
      value: diferencia(firstWeather?.actual?.temperatura, secondWeather?.actual?.temperatura),
    },
    {
      label: "Humedad",
      unit: " puntos porcentuales",
      value: diferencia(firstWeather?.actual?.humedad, secondWeather?.actual?.humedad),
    },
    {
      label: "Viento",
      unit: " km/h",
      value: diferencia(firstWeather?.actual?.viento, secondWeather?.actual?.viento),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Selectores de ciudades */}

      <section aria-label="Seleccionar ciudades para comparar" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ComparisonSelector
            label="Primera ciudad"
            city={first}
            otherId={second?.id}
            favorites={favorites.cities}
            onSelect={(city) => choose(0, city)}
          />

          <ComparisonSelector
            label="Segunda ciudad"
            city={second}
            otherId={first?.id}
            favorites={favorites.cities}
            onSelect={(city) => choose(1, city)}
          />
        </div>

        {favorites.status === "error" && (
          <p role="status" className="text-sm" style={{ color: "var(--muted)" }}>
            No se pudieron cargar los favoritos. Puedes buscar ciudades igualmente.
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-900"
          >
            {error}
          </p>
        )}

        <div className="flex justify-center">
          <button
            type="button"
            disabled={!both}
            onClick={() => {
              setError(null);
              pendingSwap.current = true;
              setCities((previous) => intercambiar(previous));
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
            style={{
              background: "var(--surface)",
              borderColor: "var(--line)",
              color: "var(--accent)",
            }}
          >
            <Icon name="compare" className="size-5" />
            Intercambiar ciudades
          </button>
        </div>
      </section>

      {/* Resultados meteorológicos */}

      {both && first && second ? (
        <section
          ref={resultsRef}
          aria-labelledby="comparacion-titulo"
          className="scroll-mt-6 space-y-5"
        >
          <div>
            <p
              className="mb-1 text-[11px] font-bold tracking-[0.14em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              DOS CIUDADES, DOS CIELOS
            </p>

            <h2
              id="comparacion-titulo"
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              Comparación meteorológica
            </h2>

            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              Explora las condiciones actuales de cada ciudad.
            </p>
          </div>

          <ScenePhotoProvider>
            <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
              <WeatherPanel key={first.id} city={first} onResult={handleWeather} />

              <WeatherPanel key={second.id} city={second} onResult={handleWeather} />
            </div>
          </ScenePhotoProvider>

          <section
            className="rounded-[24px] border p-5 sm:p-6"
            style={{ background: "var(--surface)", borderColor: "var(--line)" }}
            aria-labelledby="diferencias-titulo"
          >
            <h3
              id="diferencias-titulo"
              className="text-xs font-bold tracking-[0.12em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              Diferencias actuales
            </h3>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              {first.nombre} menos {second.nombre}
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-3">
              {differences.map(({ label, unit, value }) => (
                <div
                  key={label}
                  className="rounded-2xl p-4"
                  style={{ background: "var(--surface-soft)" }}
                >
                  <dt className="text-sm" style={{ color: "var(--muted)" }}>
                    {label}
                  </dt>
                  <dd
                    className="mt-2 text-xl font-bold tabular-nums"
                    style={{ color: "var(--ink)" }}
                  >
                    {value === null ? "No disponible" : `${value > 0 ? "+" : ""}${value}${unit}`}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="text-xs leading-5" style={{ color: "var(--muted)" }}>
            Fuente: Open-Meteo. Las observaciones corresponden a la hora del dato de cada ciudad.
            Los agregados diarios pueden verse afectados por cambios de horario de verano.
          </p>
        </section>
      ) : (
        <div
          role="status"
          className="flex flex-col items-center rounded-[26px] border border-dashed px-5 py-9 text-center"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
          }}
        >
          <span
            className="flex size-14 items-center justify-center rounded-2xl"
            style={{
              background: "var(--surface-soft)",
              color: "var(--accent)",
            }}
          >
            <Icon name="compare" className="size-7" />
          </span>

          <h2 className="mt-4 text-lg font-bold" style={{ color: "var(--ink)" }}>
            Dos lugares, una comparación
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6" style={{ color: "var(--muted)" }}>
            Selecciona dos ciudades diferentes para descubrir sus condiciones meteorológicas una al
            lado de la otra.
          </p>
        </div>
      )}
    </div>
  );
}

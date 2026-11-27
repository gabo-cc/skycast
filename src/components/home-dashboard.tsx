"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { HomeSkyExperience } from "@/components/home-sky-experience";
import { WeatherAttribution } from "@/components/weather-attribution";
import { esBusquedaValida, iniciarBusqueda, type SearchResult } from "@/lib/city-search";
import { DEFAULT_LOCATION, forecastUrl, parseLocation } from "@/lib/forecast-location";
import type { Ciudad, Clima } from "@/lib/open-meteo/types";
import { conTiempoLimite } from "@/lib/request-timeout";

const STORAGE_KEY = "skycast:ciudad-principal";

type SearchState = { status: "initial" | "loading" } | SearchResult;

type WeatherState =
  { status: "ready"; weather: Clima } | { status: "loading" } | { status: "error" };

function locationLabel(city: Ciudad): string {
  return [city.region, city.pais].filter(Boolean).join(", ") || "Ubicación no disponible";
}

function sameCity(a: Ciudad, b: Ciudad): boolean {
  return a.id === b.id && a.latitud === b.latitud && a.longitud === b.longitud;
}

function readHomeCity(): Ciudad {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved || saved.length > 1000) {
      return DEFAULT_LOCATION;
    }

    const url = new URL(saved, window.location.origin);

    if (url.origin !== window.location.origin || url.pathname !== "/pronostico") {
      return DEFAULT_LOCATION;
    }

    return parseLocation(url.searchParams) ?? DEFAULT_LOCATION;
  } catch {
    return DEFAULT_LOCATION;
  }
}

function saveHomeCity(city: Ciudad): boolean {
  try {
    if (sameCity(city, DEFAULT_LOCATION)) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, forecastUrl(city));
    }

    return true;
  } catch {
    return false;
  }
}

async function consultarClimaInicio(city: Ciudad, signal: AbortSignal): Promise<Clima> {
  const params = new URLSearchParams({
    latitud: String(city.latitud),
    longitud: String(city.longitud),
  });

  const response = await fetch(`/api/clima-inicio?${params.toString()}`, {
    signal,
    cache: "no-store",
  });

  if (!response.ok) throw new Error("No se pudo consultar el clima.");

  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("horas" in data) ||
    !Array.isArray(data.horas) ||
    !("dias" in data) ||
    !Array.isArray(data.dias) ||
    !("zonaHoraria" in data) ||
    typeof data.zonaHoraria !== "string" ||
    !("actual" in data) ||
    !("unidades" in data) ||
    !("desfaseUtcSegundos" in data)
  ) {
    throw new Error("Los datos meteorológicos están incompletos.");
  }

  return data as Clima;
}

export function HomeDashboard({ initialWeather }: { initialWeather: Clima }) {
  const [city, setCity] = useState<Ciudad>(DEFAULT_LOCATION);

  const [weatherState, setWeatherState] = useState<WeatherState>({
    status: "ready",
    weather: initialWeather,
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [searchState, setSearchState] = useState<SearchState>({
    status: "initial",
  });
  const [attempt, setAttempt] = useState(0);
  const [storageWarning, setStorageWarning] = useState(false);

  const searchRevision = useRef(0);
  const weatherRevision = useRef(0);
  const requestController = useRef<AbortController | null>(null);

  const query = term.trim();
  const valid = esBusquedaValida(query);

  const loadCity = useCallback(
    async (nextCity: Ciudad) => {
      requestController.current?.abort();

      const revision = ++weatherRevision.current;
      const controller = new AbortController();

      requestController.current = controller;

      setCity(nextCity);

      if (sameCity(nextCity, DEFAULT_LOCATION)) {
        setWeatherState({
          status: "ready",
          weather: initialWeather,
        });
        return;
      }

      setWeatherState({ status: "loading" });

      try {
        const result = await conTiempoLimite(
          (signal) => consultarClimaInicio(nextCity, signal),
          controller.signal,
        );

        if (controller.signal.aborted || revision !== weatherRevision.current) {
          return;
        }

        setWeatherState({
          status: "ready",
          weather: result,
        });
      } catch {
        if (controller.signal.aborted || revision !== weatherRevision.current) {
          return;
        }

        setWeatherState({ status: "error" });
      }
    },
    [initialWeather],
  );

  useEffect(() => {
    let active = true;
    const savedCity = readHomeCity();

    queueMicrotask(() => {
      if (active && !sameCity(savedCity, DEFAULT_LOCATION)) {
        void loadCity(savedCity);
      }
    });

    function onStorage(event: StorageEvent) {
      if (event.key !== STORAGE_KEY && event.key !== null) {
        return;
      }

      const nextCity = readHomeCity();
      void loadCity(nextCity);
    }

    window.addEventListener("storage", onStorage);

    return () => {
      active = false;
      requestController.current?.abort();
      weatherRevision.current += 1;
      window.removeEventListener("storage", onStorage);
    };
  }, [loadCity]);

  useEffect(() => {
    if (!valid || !pickerOpen) return;

    const currentRevision = searchRevision.current;

    return iniciarBusqueda(query, (result) => {
      if (searchRevision.current === currentRevision) {
        setSearchState(result);
      }
    });
  }, [query, valid, attempt, pickerOpen]);

  function changeTerm(value: string) {
    setTerm(value);

    if (value.trim() === query) return;

    searchRevision.current += 1;
    setSearchState({
      status: esBusquedaValida(value.trim()) ? "loading" : "initial",
    });
  }

  function closePicker() {
    searchRevision.current += 1;
    setPickerOpen(false);
    setTerm("");
    setSearchState({ status: "initial" });
  }

  function chooseCity(nextCity: Ciudad) {
    const saved = saveHomeCity(nextCity);

    setStorageWarning(!saved);
    closePicker();

    void loadCity(nextCity);
  }

  function retrySearch() {
    searchRevision.current += 1;
    setSearchState({ status: "loading" });
    setAttempt((value) => value + 1);
  }

  const isDefault = sameCity(city, DEFAULT_LOCATION);

  const cities = searchState.status === "success" ? searchState.ciudades : [];

  const displayedWeather = weatherState.status === "ready" ? weatherState.weather : null;

  return (
    <div className="space-y-6 pt-5 pb-7 sm:space-y-7 sm:pt-7">
      {/* ENCABEZADO PRINCIPAL */}

      <section
        aria-labelledby="inicio-titulo"
        className="sky-hero relative overflow-hidden rounded-[26px] border px-4 py-5 sm:px-7 sm:py-6"
        style={{
          borderColor: "var(--line)",
          color: "var(--ink)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-20 size-64 rounded-full opacity-20 blur-3xl"
          style={{
            background: "var(--aqua)",
          }}
        />

        <div className="relative z-10">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p
                className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase"
                style={{ color: "var(--accent)" }}
              >
                <Icon name="spark" className="size-4" />
                TU CIELO, MÁS CLARO
              </p>

              <h1
                id="inicio-titulo"
                className="text-[29px] leading-[1.15] font-bold tracking-[-0.045em] sm:text-[35px]"
                style={{ color: "var(--ink)" }}
              >
                El clima, <span style={{ color: "var(--accent)" }}>siempre contigo.</span>
              </h1>

              <p className="mt-2 max-w-lg text-sm leading-6" style={{ color: "var(--muted)" }}>
                Consulta las condiciones actuales y descubre cómo estará el cielo durante las
                próximas horas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (pickerOpen) {
                  closePicker();
                } else {
                  setPickerOpen(true);
                }
              }}
              aria-expanded={pickerOpen}
              aria-controls="home-city-picker"
              className="group flex min-h-12 w-full shrink-0 items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:w-56"
              style={{
                background: "var(--surface)",
                borderColor: "var(--line)",
                color: "var(--ink)",
              }}
            >
              <span className="flex items-center gap-2.5">
                <Icon name="search" className="size-5" />
                Cambiar ciudad
              </span>

              <Icon name="arrow" className="size-4" />
            </button>
          </div>

          {/* CIUDAD PRINCIPAL */}

          <div
            className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3"
            style={{
              background: "var(--surface)",
              borderColor: "var(--line)",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex size-10 items-center justify-center rounded-xl"
                style={{
                  background: "var(--surface-soft)",
                  color: "var(--accent)",
                }}
              >
                <Icon name="pin" className="size-5" />
              </span>

              <div>
                <p
                  className="text-[10px] font-bold tracking-wider uppercase"
                  style={{ color: "var(--accent)" }}
                >
                  MI CIUDAD PRINCIPAL
                </p>

                <p className="mt-0.5 font-bold" style={{ color: "var(--ink)" }}>
                  {city.nombre}
                </p>

                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {locationLabel(city)}
                </p>
              </div>
            </div>

            {isDefault ? (
              <span
                className="rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{
                  background: "var(--surface-soft)",
                  color: "var(--accent)",
                }}
              >
                Predeterminada
              </span>
            ) : (
              <button
                type="button"
                onClick={() => chooseCity(DEFAULT_LOCATION)}
                className="min-h-11 rounded-xl px-3 text-xs font-semibold underline underline-offset-4"
                style={{ color: "var(--accent)" }}
              >
                Restablecer San Salvador
              </button>
            )}
          </div>

          {/* BUSCADOR PARA CAMBIAR CIUDAD */}

          {pickerOpen && (
            <div
              id="home-city-picker"
              className="mb-5 rounded-2xl border p-4 shadow-sm sm:p-5"
              style={{
                background: "var(--surface)",
                borderColor: "var(--line)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold" style={{ color: "var(--ink)" }}>
                  Elige tu ciudad principal
                </h2>

                <button
                  type="button"
                  onClick={closePicker}
                  className="min-h-11 rounded-lg px-3 text-xs font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  Cerrar
                </button>
              </div>

              <label
                htmlFor="home-city-search"
                className="mt-4 block text-xs font-semibold"
                style={{ color: "var(--ink)" }}
              >
                Buscar ciudad
              </label>

              <div
                className="home-city-search-field mt-2 flex items-center gap-3 rounded-xl px-3"
                style={{
                  background: "var(--page)",
                }}
              >
                <Icon name="search" className="size-5" />

                <input
                  id="home-city-search"
                  type="search"
                  autoComplete="off"
                  maxLength={100}
                  value={term}
                  onChange={(event) => changeTerm(event.target.value)}
                  placeholder="Por ejemplo, Metapán"
                  className="home-city-search-input min-h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--ink)" }}
                />
              </div>

              <div
                role="status"
                aria-live="polite"
                className="mt-3 text-xs"
                style={{ color: "var(--muted)" }}
              >
                {searchState.status === "initial" && "Escribe al menos dos caracteres."}

                {searchState.status === "loading" && "Buscando ciudades…"}

                {searchState.status === "error" && searchState.message}

                {searchState.status === "success" && `${cities.length} resultados encontrados.`}
              </div>

              {searchState.status === "error" && (
                <button
                  type="button"
                  onClick={retrySearch}
                  className="mt-2 min-h-11 text-sm font-semibold underline"
                  style={{ color: "var(--accent)" }}
                >
                  Reintentar búsqueda
                </button>
              )}

              {cities.length > 0 && (
                <ul
                  className="mt-3 max-h-64 overflow-y-auto rounded-xl border p-1"
                  style={{
                    borderColor: "var(--line)",
                  }}
                >
                  {cities.map((result) => (
                    <li key={result.id}>
                      <button
                        type="button"
                        onClick={() => chooseCity(result)}
                        className="flex min-h-14 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--surface-soft)]"
                      >
                        <Icon name="pin" className="size-5 shrink-0" />

                        <span className="min-w-0 flex-1">
                          <span
                            className="block text-sm font-semibold"
                            style={{
                              color: "var(--ink)",
                            }}
                          >
                            {result.nombre}
                          </span>

                          <span
                            className="block text-xs"
                            style={{
                              color: "var(--muted)",
                            }}
                          >
                            {locationLabel(result)}
                          </span>
                        </span>

                        <Icon name="arrow" className="size-4 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {storageWarning && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950"
            >
              La ciudad cambió, pero el navegador no permitió guardar la preferencia para futuras
              visitas.
            </p>
          )}

          {/* CLIMA ACTUAL */}

          {displayedWeather ? (
            <HomeSkyExperience
              key={`${city.id}:${city.latitud}:${city.longitud}`}
              city={city}
              weather={displayedWeather}
            />
          ) : (
            <div
              role="status"
              className="flex min-h-72 flex-col items-center justify-center rounded-[24px] border p-6 text-center"
              style={{
                background: "var(--surface)",
                borderColor: "var(--line)",
              }}
            >
              <Icon name="cloud" className="size-10" />

              <p className="mt-4 font-semibold" style={{ color: "var(--ink)" }}>
                {weatherState.status === "loading"
                  ? `Consultando el clima de ${city.nombre}…`
                  : "No se pudo cargar el clima."}
              </p>

              {weatherState.status === "error" && (
                <button
                  type="button"
                  onClick={() => void loadCity(city)}
                  className="mt-4 min-h-11 rounded-xl px-5 text-sm font-semibold text-white"
                  style={{
                    background: "var(--accent)",
                  }}
                >
                  Reintentar
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ACCESOS RÁPIDOS */}

      <section aria-label="Otras herramientas de SkyCast" className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/favoritos"
          className="feature-card group flex items-center gap-3 rounded-2xl border p-4"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
            color: "var(--ink)",
          }}
        >
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "var(--surface-soft)",
              color: "var(--favorite)",
            }}
          >
            <Icon name="heart" className="size-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Tus favoritos</span>

            <span className="mt-0.5 block text-xs" style={{ color: "var(--muted)" }}>
              Tus ciudades guardadas
            </span>
          </span>

          <Icon
            name="arrow"
            className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
          />
        </Link>

        <Link
          href="/comparar"
          className="feature-card group flex items-center gap-3 rounded-2xl border p-4"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
            color: "var(--ink)",
          }}
        >
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "var(--surface-soft)",
              color: "var(--accent)",
            }}
          >
            <Icon name="compare" className="size-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Compara ciudades</span>

            <span className="mt-0.5 block text-xs" style={{ color: "var(--muted)" }}>
              Dos lugares, un vistazo
            </span>
          </span>

          <Icon
            name="arrow"
            className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </section>

      <p className="text-[11px] leading-5" style={{ color: "var(--muted)" }}>
        Fuente: <WeatherAttribution />. Los valores diarios pueden abarcar horas distintas del día
        local durante cambios de horario de verano.
      </p>
    </div>
  );
}

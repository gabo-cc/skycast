"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { CityPhotoBackground, CityPhotoCredit } from "@/components/city-photo";
import { ScenePhotoProvider, useScenePhoto } from "@/components/scene-photos";
import { WeatherAtmosphere } from "@/components/weather-atmosphere";
import { WeatherAttribution } from "@/components/weather-attribution";
import { useFavorites } from "@/hooks/use-favorites";
import type { ClimaComparable } from "@/lib/comparison";
import { consultarClimaFavorito } from "@/lib/favorite-weather";
import { forecastUrl } from "@/lib/forecast-location";
import { FavoriteHeart } from "@/components/favorite-heart";
import type { Ciudad } from "@/lib/open-meteo/types";
import { condicion, valor } from "@/lib/weather-display";

export function FavoriteCityCard({ city, onRemove }: { city: Ciudad; onRemove: () => void }) {
  const location = [city.region, city.pais].filter(Boolean).join(", ") || "Ubicación no disponible";
  const [state, setState] = useState<
    { status: "loading" | "error" } | { status: "ready"; weather: ClimaComparable }
  >({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [removing, setRemoving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { latitud, longitud } = city;

  useEffect(() => {
    const controller = new AbortController();
    consultarClimaFavorito({ latitud, longitud }, controller.signal).then(
      (weather) => {
        if (!controller.signal.aborted) setState({ status: "ready", weather });
      },
      () => {
        if (!controller.signal.aborted) setState({ status: "error" });
      },
    );
    return () => controller.abort();
  }, [latitud, longitud, attempt]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function remove() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onRemove();
      return;
    }
    setRemoving(true);
    timer.current = setTimeout(onRemove, 200);
  }

  const current = state.status === "ready" ? state.weather.actual : null;
  const cityPhoto = useScenePhoto(
    city,
    current?.codigoMeteorologico ?? null,
    current?.esDeDia ?? null,
  );
  const condition = condicion(current?.codigoMeteorologico ?? null, current?.esDeDia ?? null);

  return (
    <li
      className={`favorite-weather-card atmosphere-container group min-h-72 overflow-hidden rounded-[24px] border border-white/20 ${removing ? "is-removing" : ""}`}
    >
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
      <div className="favorite-weather-content atmosphere-content pointer-events-none flex min-h-72 flex-col justify-between p-5 text-white sm:p-6">
        <div className="pr-14">
          <p className="text-xs font-bold tracking-[0.14em] uppercase">Ciudad favorita</p>
          <h3 className="mt-2 text-2xl font-bold break-words">{city.nombre}</h3>
          <p className="mt-1 text-sm break-words text-white/90">{location}</p>
          {(!cityPhoto.loaded || cityPhoto.illustrative) && (
            <p className="mt-2 text-xs text-white/85">Paisaje ilustrativo</p>
          )}
        </div>
        <div className="mt-6">
          {state.status === "ready" ? (
            <>
              <p className="text-5xl font-bold tracking-tight tabular-nums">
                {valor(current?.temperatura ?? null, "°C")}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                <Icon name={condition.icono} className="size-5" />
                {condition.descripcion}
              </p>
            </>
          ) : (
            <div>
              <p
                role={state.status === "error" ? "alert" : "status"}
                className="text-sm font-medium"
              >
                {state.status === "loading"
                  ? "Consultando el clima…"
                  : "No se pudo consultar el clima."}
              </p>
              {state.status === "error" && (
                <button
                  type="button"
                  className="pointer-events-auto mt-3 min-h-11 rounded-xl bg-white px-3 text-sm font-bold text-slate-900"
                  onClick={() => {
                    setState({ status: "loading" });
                    setAttempt((value) => value + 1);
                  }}
                >
                  Reintentar
                </button>
              )}
            </div>
          )}
          <p className="mt-5 flex items-center justify-between gap-2 border-t border-white/30 pt-4 text-sm font-semibold">
            Ver pronóstico completo{" "}
            <Icon name="arrow" className="size-5 transition-transform group-hover:translate-x-1" />
          </p>
          <CityPhotoCredit photo={cityPhoto.loaded ? cityPhoto.photo : null} />
        </div>
      </div>
      <Link
        href={forecastUrl(city)}
        prefetch={false}
        aria-label={`Ver pronóstico de ${city.nombre}, ${location}`}
        className="favorite-card-link absolute inset-0 z-10 rounded-[24px]"
      />
      <div className="absolute top-4 right-4 z-20 rounded-xl bg-slate-950/70 text-white">
        <FavoriteHeart
          active
          disabled={removing}
          label={`${city.nombre}, ${location}`}
          onClick={remove}
        />
      </div>
    </li>
  );
}

export function FavoriteCities() {
  const favorites = useFavorites();

  if (favorites.status === "loading") {
    return (
      <section
        aria-label="Cargando ciudades favoritas"
        role="status"
        className="grid gap-4 sm:grid-cols-2"
      >
        {[1, 2].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-3xl border p-6"
            style={{
              background: "var(--surface)",
              borderColor: "var(--line)",
            }}
          >
            <div className="size-12 rounded-2xl" style={{ background: "var(--surface-soft)" }} />

            <div
              className="mt-6 h-5 w-2/3 rounded-full"
              style={{ background: "var(--surface-soft)" }}
            />

            <div
              className="mt-3 h-3 w-4/5 rounded-full"
              style={{ background: "var(--surface-soft)" }}
            />

            <div className="mt-10 h-10 rounded-xl" style={{ background: "var(--surface-soft)" }} />
          </div>
        ))}
        <span className="sr-only">Cargando favoritos…</span>
      </section>
    );
  }

  if (favorites.status === "error") {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-950"
      >
        <p>{favorites.error}</p>

        <button
          type="button"
          onClick={favorites.reload}
          className="mt-3 min-h-11 font-semibold underline"
        >
          Reintentar acceso a favoritos
        </button>
      </div>
    );
  }

  if (!favorites.cities.length) {
    return (
      <section
        aria-labelledby="sin-favoritos-titulo"
        className="relative overflow-hidden rounded-[28px] border border-dashed px-6 py-12 text-center sm:py-16"
        style={{
          background: "var(--surface)",
          borderColor: "var(--line)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--aqua)" }}
        />

        <div className="relative mx-auto max-w-md">
          <span
            className="mx-auto flex size-17 items-center justify-center rounded-[22px]"
            style={{
              background: "var(--surface-soft)",
              color: "var(--favorite)",
            }}
          >
            <Icon name="heart" className="size-8" />
          </span>

          <h2
            id="sin-favoritos-titulo"
            className="mt-6 text-2xl font-bold tracking-tight"
            style={{ color: "var(--ink)" }}
          >
            Tus lugares favoritos comienzan aquí
          </h2>

          <p className="mt-3 text-sm leading-7" style={{ color: "var(--muted)" }}>
            Guarda las ciudades que más te interesan y consúltalas fácilmente cuando quieras saber
            cómo estará el cielo.
          </p>

          <Link
            href="/buscar"
            className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-xl px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            <Icon name="search" className="size-5" />
            Explorar ciudades
            <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="favoritos-titulo" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p
            className="mb-1 text-[11px] font-bold tracking-[0.14em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            TU COLECCIÓN
          </p>

          <h2
            id="favoritos-titulo"
            className="text-xl font-bold tracking-tight sm:text-2xl"
            style={{ color: "var(--ink)" }}
          >
            Ciudades guardadas
          </h2>
        </div>

        <span
          className="rounded-full border px-3 py-1.5 text-xs font-semibold"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
            color: "var(--accent)",
          }}
        >
          {favorites.cities.length} {favorites.cities.length === 1 ? "ciudad" : "ciudades"}
        </span>
      </div>

      <ScenePhotoProvider>
        <ul className="grid gap-4 sm:grid-cols-2">
          {favorites.cities.map((city) => (
            <FavoriteCityCard key={city.id} city={city} onRemove={() => favorites.remove(city)} />
          ))}
        </ul>
      </ScenePhotoProvider>

      <p className="text-xs leading-5" style={{ color: "var(--muted)" }}>
        Fuente: <WeatherAttribution />.
      </p>

      <Link
        href="/buscar"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors hover:bg-[var(--surface-soft)]"
        style={{ color: "var(--accent)" }}
      >
        <Icon name="search" className="size-4" />
        Buscar más ciudades
        <Icon name="arrow" className="size-4" />
      </Link>
    </section>
  );
}

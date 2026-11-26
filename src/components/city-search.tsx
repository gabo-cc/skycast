"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { esBusquedaValida, iniciarBusqueda, type SearchResult } from "@/lib/city-search";
import type { Ciudad } from "@/lib/open-meteo/types";
import { forecastUrl } from "@/lib/forecast-location";
import { useFavorites } from "@/hooks/use-favorites";
import { FavoriteHeart } from "@/components/favorite-heart";

type SearchState = { status: "initial" | "loading" } | SearchResult;

function CityResult({
  city,
  favorite,
  favoritesReady,
  onToggleFavorite,
}: {
  city: Ciudad;
  favorite: boolean;
  favoritesReady: boolean;
  onToggleFavorite: () => void;
}) {
  const location = [city.region, city.pais].filter(Boolean).join(", ") || "Ubicación no disponible";

  return (
    <li className="group relative border-b last:border-b-0" style={{ borderColor: "var(--line)" }}>
      <div className="flex items-center gap-2 p-2 sm:p-2.5">
        <Link
          href={forecastUrl(city)}
          className="flex min-h-17 min-w-0 flex-1 items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)] sm:gap-4 sm:px-3"
          aria-label={`Ver pronóstico de ${city.nombre}, ${location}`}
        >
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105"
            style={{
              background: "var(--surface-soft)",
              color: "var(--accent)",
            }}
          >
            <Icon name="pin" className="size-5" />
          </span>

          <span className="min-w-0 flex-1">
            <span
              className="block text-[15px] font-bold tracking-tight break-words"
              style={{ color: "var(--ink)" }}
            >
              {city.nombre}
            </span>
            <span
              className="mt-1 block text-xs leading-5 break-words sm:text-sm"
              style={{ color: "var(--muted)" }}
            >
              {location}
            </span>
          </span>

          <span
            aria-hidden="true"
            className="hidden shrink-0 items-center gap-1 text-xs font-semibold opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 md:inline-flex"
            style={{ color: "var(--accent)" }}
          >
            Ver clima
            <Icon name="arrow" className="size-4" />
          </span>
        </Link>

        <div className="shrink-0 pr-1 sm:pr-3">
          <FavoriteHeart
            active={favorite}
            disabled={!favoritesReady}
            label={`${city.nombre}, ${location}`}
            onClick={onToggleFavorite}
          />
        </div>
      </div>
    </li>
  );
}

export function CitySearch() {
  const favorites = useFavorites();

  const [term, setTerm] = useState("");
  const [state, setState] = useState<SearchState>({
    status: "initial",
  });
  const [attempt, setAttempt] = useState(0);

  const revision = useRef(0);

  const query = term.trim();
  const valid = esBusquedaValida(query);

  useEffect(() => {
    if (!valid) return;

    const current = revision.current;

    return iniciarBusqueda(query, (result) => {
      if (revision.current === current) {
        setState(result);
      }
    });
  }, [query, valid, attempt]);

  function changeTerm(value: string) {
    setTerm(value);

    if (value.trim() === query) return;

    revision.current += 1;

    setState({
      status: esBusquedaValida(value.trim()) ? "loading" : "initial",
    });
  }

  function retrySearch() {
    revision.current += 1;
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }

  const cities = state.status === "success" ? state.ciudades : [];

  return (
    <div className="space-y-6">
      {/* Buscador principal */}

      <section
        aria-labelledby="buscar-titulo"
        className="relative overflow-hidden rounded-[28px] border p-5 shadow-sm sm:p-7"
        style={{
          background: "var(--surface)",
          borderColor: "var(--line)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 -right-20 size-64 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--aqua)" }}
        />

        <div className="relative z-10">
          <div className="flex items-start gap-3">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: "var(--surface-soft)",
                color: "var(--accent)",
              }}
            >
              <Icon name="search" className="size-5" />
            </span>

            <div className="min-w-0">
              <h2
                id="buscar-titulo"
                className="text-lg font-bold tracking-tight sm:text-xl"
                style={{ color: "var(--ink)" }}
              >
                ¿Qué ciudad quieres explorar?
              </h2>

              <p
                id="buscar-ayuda"
                className="mt-1 text-sm leading-6"
                style={{ color: "var(--muted)" }}
              >
                Escribe al menos dos caracteres para encontrar ciudades de todo el mundo.
              </p>
            </div>
          </div>

          <label
            htmlFor="ciudad"
            className="mt-6 block text-sm font-semibold"
            style={{ color: "var(--ink)" }}
          >
            Nombre de la ciudad
          </label>

          <div
            className="city-search-field mt-2 flex min-h-14 items-center gap-3 rounded-2xl px-4"
            style={{
              background: "var(--page)",
            }}
          >
            <Icon name="search" className="size-5 shrink-0" />

            <input
              id="ciudad"
              type="search"
              autoComplete="off"
              maxLength={100}
              value={term}
              onChange={(event) => changeTerm(event.target.value)}
              aria-describedby="buscar-ayuda"
              placeholder="Por ejemplo, San Salvador"
              className="min-h-13 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:opacity-60"
              style={{ color: "var(--ink)" }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Selecciona una ciudad para consultar directamente su pronóstico.
            </p>

            {query && (
              <span
                className="rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  background: "var(--surface-soft)",
                  color: "var(--accent)",
                }}
              >
                Búsqueda por nombre
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Resultados */}

      <section
        aria-labelledby="resultados-titulo"
        aria-busy={state.status === "loading"}
        className="space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p
              className="mb-1 text-[11px] font-bold tracking-[0.14em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              EXPLORA EL MUNDO
            </p>

            <h2
              id="resultados-titulo"
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              Resultados
            </h2>
          </div>

          {state.status === "success" && cities.length > 0 && (
            <span
              className="rounded-full border px-3 py-1.5 text-xs font-semibold"
              style={{
                background: "var(--surface)",
                color: "var(--accent)",
                borderColor: "var(--line)",
              }}
            >
              {cities.length} {cities.length === 1 ? "ciudad encontrada" : "ciudades encontradas"}
            </span>
          )}
        </div>

        {favorites.status === "error" && (
          <div
            role="alert"
            className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
          >
            <p>{favorites.error}</p>

            <button
              type="button"
              onClick={favorites.reload}
              className="mt-2 min-h-11 font-semibold underline"
            >
              Reintentar acceso a favoritos
            </button>
          </div>
        )}

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-sm"
          style={{ color: "var(--muted)" }}
        >
          {state.status === "loading" && "Buscando ciudades…"}

          {state.status === "error" && state.message}

          {state.status === "success" &&
            cities.length === 0 &&
            "No encontramos ciudades con ese nombre."}
        </div>

        {state.status === "initial" && (
          <div
            className="flex flex-col items-center rounded-3xl border border-dashed px-5 py-9 text-center sm:py-11"
            style={{
              borderColor: "var(--line)",
              background: "var(--surface)",
            }}
          >
            <span
              className="mb-4 flex size-15 items-center justify-center rounded-2xl"
              style={{
                background: "var(--surface-soft)",
                color: "var(--accent)",
              }}
            >
              <Icon name="pin" className="size-7" />
            </span>

            <h3 className="text-base font-bold" style={{ color: "var(--ink)" }}>
              Tu próxima ciudad comienza aquí
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6" style={{ color: "var(--muted)" }}>
              {query
                ? "Escribe al menos dos caracteres para comenzar."
                : "Busca una ciudad y descubre sus condiciones meteorológicas."}
            </p>
          </div>
        )}

        {state.status === "loading" && (
          <div
            className="space-y-2 rounded-3xl border p-3"
            style={{
              background: "var(--surface)",
              borderColor: "var(--line)",
            }}
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                aria-hidden="true"
                className="flex items-center gap-3 rounded-2xl p-3"
              >
                <span
                  className="size-11 shrink-0 animate-pulse rounded-2xl"
                  style={{
                    background: "var(--surface-soft)",
                  }}
                />

                <span className="flex-1 space-y-2">
                  <span
                    className="block h-3 w-1/3 animate-pulse rounded-full"
                    style={{
                      background: "var(--surface-soft)",
                    }}
                  />

                  <span
                    className="block h-2.5 w-1/2 animate-pulse rounded-full"
                    style={{
                      background: "var(--surface-soft)",
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        )}

        {state.status === "error" && (
          <button
            type="button"
            onClick={retrySearch}
            className="min-h-11 rounded-xl px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: "var(--accent)",
            }}
          >
            Reintentar búsqueda
          </button>
        )}

        {state.status === "success" && cities.length > 0 && (
          <ul
            className="overflow-hidden rounded-3xl border shadow-sm"
            style={{
              background: "var(--surface)",
              borderColor: "var(--line)",
            }}
          >
            {cities.map((city) => {
              const isFavorite = favorites.cities.some((item) => item.id === city.id);

              return (
                <CityResult
                  key={city.id}
                  city={city}
                  favorite={isFavorite}
                  favoritesReady={favorites.status === "ready"}
                  onToggleFavorite={() =>
                    isFavorite ? favorites.remove(city) : favorites.add(city)
                  }
                />
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { esBusquedaValida, iniciarBusqueda, type SearchResult } from "@/lib/city-search";
import type { Ciudad } from "@/lib/open-meteo/types";

type SearchState = { status: "initial" | "loading" } | SearchResult;

function CityResult({
  city,
  selected,
  onSelect,
}: {
  city: Ciudad;
  selected: boolean;
  onSelect: () => void;
}) {
  const location = [city.region, city.pais].filter(Boolean).join(", ") || "Ubicación no disponible";
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`flex min-h-24 w-full items-center gap-4 rounded-2xl border p-5 text-left transition-colors ${selected ? "border-sky-600 bg-sky-50 ring-1 ring-sky-600" : "border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50/50"}`}
      >
        <span className="rounded-xl bg-sky-100 p-3 text-sky-700">
          <Icon name="pin" className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold break-words text-slate-900">{city.nombre}</span>
          <span className="mt-1 block text-sm break-words text-slate-600">{location}</span>
        </span>
        <span className="text-sm font-semibold text-sky-700">
          {selected ? "Seleccionada" : "Elegir"}
        </span>
      </button>
    </li>
  );
}

export function CitySearch() {
  const [term, setTerm] = useState("");
  const [state, setState] = useState<SearchState>({ status: "initial" });
  const [selected, setSelected] = useState<Ciudad | null>(null);
  const [attempt, setAttempt] = useState(0);
  const revision = useRef(0);
  const query = term.trim();
  const valid = esBusquedaValida(query);

  useEffect(() => {
    if (!valid) return;
    const current = revision.current;
    return iniciarBusqueda(query, (result) => {
      if (revision.current === current) setState(result);
    });
  }, [query, valid, attempt]);

  function changeTerm(value: string) {
    setTerm(value);
    if (value.trim() === query) return;
    revision.current += 1;
    setSelected(null);
    setState({ status: esBusquedaValida(value) ? "loading" : "initial" });
  }

  const forecastParams = selected
    ? new URLSearchParams({
        latitud: String(selected.latitud),
        longitud: String(selected.longitud),
      })
    : null;

  return (
    <div className="space-y-8">
      <section
        aria-labelledby="buscar-titulo"
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
      >
        <h2 id="buscar-titulo" className="text-lg font-semibold text-slate-900">
          Búsqueda de ciudades
        </h2>
        <p id="buscar-ayuda" className="mt-1 text-sm leading-6 text-slate-600">
          Escribe al menos dos caracteres para buscar por nombre.
        </p>
        <label htmlFor="ciudad" className="mt-5 block text-sm font-semibold text-slate-800">
          Nombre de la ciudad
        </label>
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 focus-within:border-sky-700 focus-within:ring-2 focus-within:ring-sky-200">
          <Icon name="search" className="size-5 shrink-0 text-slate-500" />
          <input
            id="ciudad"
            type="search"
            autoComplete="off"
            maxLength={100}
            value={term}
            onChange={(event) => changeTerm(event.target.value)}
            aria-describedby="buscar-ayuda"
            placeholder="Por ejemplo, San Salvador"
            className="min-h-12 min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-500"
          />
        </div>
      </section>
      <section aria-labelledby="resultados-titulo" aria-busy={state.status === "loading"}>
        <h2 id="resultados-titulo" className="text-xl font-semibold text-slate-900">
          Resultados
        </h2>
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mt-3 text-sm leading-6 text-slate-600"
        >
          {state.status === "initial" && (
            <p>
              {query
                ? "Escribe al menos dos caracteres para comenzar."
                : "Escribe una ciudad para comenzar la búsqueda."}
            </p>
          )}
          {state.status === "loading" && <p>Buscando ciudades…</p>}
          {state.status === "error" && <p>{state.message}</p>}
          {state.status === "success" && (
            <p>
              {state.ciudades.length === 0
                ? "No encontramos ciudades con ese nombre."
                : `${state.ciudades.length} ${state.ciudades.length === 1 ? "ciudad encontrada" : "ciudades encontradas"}.`}
            </p>
          )}
        </div>
        {state.status === "error" && (
          <button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              setAttempt((value) => value + 1);
            }}
            className="mt-4 min-h-11 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Reintentar
          </button>
        )}
        {state.status === "success" && (
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {state.ciudades.map((city) => (
              <CityResult
                key={city.id}
                city={city}
                selected={selected?.id === city.id}
                onSelect={() => setSelected(city)}
              />
            ))}
          </ul>
        )}
      </section>
      {selected && forecastParams && (
        <section
          aria-labelledby="seleccion-titulo"
          className="rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6"
        >
          <h2 id="seleccion-titulo" className="text-lg font-semibold text-slate-900">
            Ciudad seleccionada: {selected.nombre}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {[selected.region, selected.pais].filter(Boolean).join(", ") ||
              "Ubicación no disponible"}{" "}
            · Latitud {selected.latitud}, longitud {selected.longitud}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            La página de pronóstico todavía muestra datos de ejemplo y no utiliza esta ubicación.
          </p>
          <Link
            href={`/pronostico?${forecastParams}`}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-sky-800"
          >
            Ver diseño del pronóstico <Icon name="arrow" className="size-4" />
          </Link>
        </section>
      )}
    </div>
  );
}

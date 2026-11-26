"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { esBusquedaValida, iniciarBusqueda, type SearchResult } from "@/lib/city-search";
import type { Ciudad } from "@/lib/open-meteo/types";

type SearchState = { status: "initial" | "loading" } | SearchResult;

type ComparisonSelectorProps = {
  label: string;
  city: Ciudad | null;
  otherId: number | undefined;
  favorites: Ciudad[];
  onSelect: (city: Ciudad) => void;
};

function locationLabel(city: Ciudad): string {
  return [city.region, city.pais].filter(Boolean).join(", ") || "Ubicación no disponible";
}

export function ComparisonSelector({
  label,
  city,
  otherId,
  favorites,
  onSelect,
}: ComparisonSelectorProps) {
  const inputId = useId();

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

  function update(value: string) {
    const next = value.trim();

    revision.current += 1;
    setTerm(value);

    setState({
      status: esBusquedaValida(next) ? "loading" : "initial",
    });
  }

  function choose(value: Ciudad) {
    if (value.id === otherId) return;

    onSelect(value);
    update("");
  }

  function retry() {
    revision.current += 1;
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }

  function renderOption(item: Ciudad) {
    const disabled = item.id === otherId;
    const selected = item.id === city?.id;

    return (
      <li key={item.id}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => choose(item)}
          className="group/option flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "var(--surface-soft)",
              color: "var(--accent)",
            }}
          >
            <Icon name="pin" className="size-4" />
          </span>

          <span className="min-w-0 flex-1">
            <span
              className="block text-sm font-semibold break-words"
              style={{ color: "var(--ink)" }}
            >
              {item.nombre}
            </span>

            <span
              className="mt-0.5 block text-xs leading-5 break-words"
              style={{ color: "var(--muted)" }}
            >
              {locationLabel(item)}
            </span>
          </span>

          {disabled ? (
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>
              En uso
            </span>
          ) : selected ? (
            <span className="text-[11px] font-semibold" style={{ color: "var(--accent)" }}>
              Seleccionada
            </span>
          ) : (
            <Icon
              name="arrow"
              className="size-4 shrink-0 opacity-0 transition-opacity group-hover/option:opacity-100"
            />
          )}
        </button>
      </li>
    );
  }

  return (
    <section
      className="min-w-0 rounded-[24px] border p-4 shadow-sm sm:p-5"
      style={{
        background: "var(--surface)",
        borderColor: "var(--line)",
      }}
    >
      {/* ENCABEZADO */}

      <div className="flex items-start gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: "var(--surface-soft)",
            color: "var(--accent)",
          }}
        >
          <Icon name="pin" className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold tracking-tight" style={{ color: "var(--ink)" }}>
            {label}
          </h2>

          <p
            className="mt-1 text-sm leading-5 break-words"
            style={{
              color: city ? "var(--accent)" : "var(--muted)",
            }}
          >
            {city ? `${city.nombre} · ${locationLabel(city)}` : "Elige una ciudad para comenzar"}
          </p>
        </div>

        {city && (
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              background: "var(--surface-soft)",
              color: "var(--accent)",
            }}
          >
            Elegida
          </span>
        )}
      </div>

      {/* BUSCADOR */}

      <label
        htmlFor={inputId}
        className="mt-5 block text-xs font-semibold"
        style={{ color: "var(--ink)" }}
      >
        Buscar {label.toLowerCase()}
      </label>

      <div
        className="comparison-search-field mt-2 flex min-h-12 items-center gap-3 rounded-xl px-3"
        style={{
          background: "var(--page)",
        }}
      >
        <Icon name="search" className="size-5 shrink-0" />

        <input
          id={inputId}
          type="search"
          autoComplete="off"
          maxLength={100}
          value={term}
          onChange={(event) => update(event.target.value)}
          placeholder="Nombre de la ciudad"
          className="comparison-search-input min-h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--ink)" }}
        />
      </div>

      {/* ESTADO DE LA BÚSQUEDA */}

      <div role="status" aria-live="polite" className="text-xs" style={{ color: "var(--muted)" }}>
        {state.status === "loading" && <p className="mt-3">Buscando ciudades…</p>}

        {state.status === "error" && <p className="mt-3">{state.message}</p>}

        {state.status === "success" && (
          <p className="mt-3">
            {state.ciudades.length === 0
              ? "No se encontraron ciudades."
              : `${state.ciudades.length} resultados encontrados.`}
          </p>
        )}
      </div>

      {state.status === "error" && (
        <button
          type="button"
          onClick={retry}
          className="mt-3 min-h-11 text-sm font-semibold underline"
          style={{ color: "var(--accent)" }}
        >
          Reintentar búsqueda
        </button>
      )}

      {/* RESULTADOS */}

      {state.status === "success" && state.ciudades.length > 0 && (
        <ul
          className="mt-3 max-h-60 space-y-1 overflow-y-auto rounded-xl border p-1.5"
          style={{
            borderColor: "var(--line)",
          }}
        >
          {state.ciudades.map(renderOption)}
        </ul>
      )}

      {/* FAVORITOS */}

      {!query && favorites.length > 0 && (
        <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--line)" }}>
          <div className="mb-2 flex items-center gap-2">
            <Icon name="heart" className="size-4" />

            <p
              className="text-[11px] font-bold tracking-[0.12em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              Tus favoritos
            </p>
          </div>

          <ul className="max-h-44 space-y-1 overflow-y-auto">{favorites.map(renderOption)}</ul>
        </div>
      )}
    </section>
  );
}

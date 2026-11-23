"use client";

import { useEffect, useRef, useState } from "react";
import { esBusquedaValida, iniciarBusqueda, type SearchResult } from "@/lib/city-search";
import type { Ciudad } from "@/lib/open-meteo/types";

export function ComparisonSelector({
  label,
  city,
  otherId,
  favorites,
  onSelect,
}: {
  label: string;
  city: Ciudad | null;
  otherId: number | undefined;
  favorites: Ciudad[];
  onSelect: (city: Ciudad) => void;
}) {
  const [term, setTerm] = useState("");
  const [state, setState] = useState<{ status: "initial" | "loading" } | SearchResult>({
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
      if (revision.current === current) setState(result);
    });
  }, [query, valid, attempt]);
  function update(value: string) {
    setTerm(value);
    if (value.trim() === query) return;
    revision.current++;
    setState({ status: esBusquedaValida(value) ? "loading" : "initial" });
  }
  function choose(value: Ciudad) {
    onSelect(value);
    update("");
  }
  const option = (item: Ciudad) => (
    <li key={item.id}>
      <button
        type="button"
        disabled={item.id === otherId}
        onClick={() => choose(item)}
        className="min-h-11 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-800 hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        <span className="font-semibold">{item.nombre}</span> ·{" "}
        {[item.region, item.pais].filter(Boolean).join(", ") || "Ubicación no disponible"}
        {item.id === otherId && " · Ya seleccionada"}
      </button>
    </li>
  );
  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-900">{label}</h2>
      <p className="mt-2 min-h-6 text-sm text-slate-600">
        {city
          ? `${city.nombre} · ${[city.region, city.pais].filter(Boolean).join(", ") || "Ubicación no disponible"}`
          : "Sin seleccionar"}
      </p>
      <label htmlFor={label} className="mt-4 block text-sm font-semibold text-slate-800">
        Buscar {label.toLowerCase()}
      </label>
      <input
        id={label}
        type="search"
        maxLength={100}
        value={term}
        onChange={(event) => update(event.target.value)}
        placeholder="Nombre de la ciudad"
        className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-900"
      />
      <div role="status" aria-live="polite" className="mt-2 text-sm text-slate-600">
        {state.status === "loading" && "Buscando ciudades…"}
        {state.status === "error" && state.message}
        {state.status === "success" &&
          (state.ciudades.length
            ? `${state.ciudades.length} resultados`
            : "No se encontraron ciudades.")}
      </div>
      {state.status === "error" && (
        <button
          type="button"
          className="mt-2 min-h-11 text-sm font-semibold text-sky-800 underline"
          onClick={() => {
            setState({ status: "loading" });
            setAttempt((value) => value + 1);
          }}
        >
          Reintentar búsqueda
        </button>
      )}
      {state.status === "success" && (
        <ul className="mt-2 max-h-60 overflow-y-auto">{state.ciudades.map(option)}</ul>
      )}
      {!query && favorites.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-600 uppercase">Favoritos</p>
          <ul className="mt-1 max-h-40 overflow-y-auto">{favorites.map(option)}</ul>
        </div>
      )}
    </section>
  );
}

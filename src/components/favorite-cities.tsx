"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { useFavorites } from "@/hooks/use-favorites";
import { forecastUrl } from "@/lib/forecast-location";

export function FavoriteCities() {
  const favorites = useFavorites();
  if (favorites.status === "loading")
    return (
      <p role="status" className="text-slate-600">
        Cargando favoritos…
      </p>
    );
  if (favorites.status === "error")
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
          Reintentar
        </button>
      </div>
    );
  if (!favorites.cities.length)
    return (
      <section className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <span className="rounded-2xl bg-sky-50 p-4 text-sky-700">
          <Icon name="heart" className="size-8" />
        </span>
        <h2 className="mt-6 text-xl font-semibold text-slate-900">Aún no hay ciudades favoritas</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
          Busca una ciudad y guárdala para encontrarla aquí.
        </p>
        <Link
          href="/buscar"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-sky-800"
        >
          Explorar ciudades <Icon name="arrow" className="size-4" />
        </Link>
      </section>
    );
  return (
    <section aria-labelledby="favoritos-titulo">
      <h2 id="favoritos-titulo" className="text-xl font-semibold text-slate-900">
        Ciudades guardadas
      </h2>
      <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {favorites.cities.map((city) => {
          const location =
            [city.region, city.pais].filter(Boolean).join(", ") || "Ubicación no disponible";
          return (
            <li
              key={city.id}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6"
            >
              <h3 className="text-lg font-semibold break-words text-slate-900">{city.nombre}</h3>
              <p className="mt-1 text-sm break-words text-slate-600">{location}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={forecastUrl(city)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-sky-800"
                >
                  Ver pronóstico <Icon name="arrow" className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => favorites.remove(city)}
                  aria-label={`Quitar de favoritos: ${city.nombre}, ${location}`}
                  className="min-h-11 rounded-xl px-3 text-sm font-semibold text-sky-800 hover:bg-sky-50"
                >
                  Quitar
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

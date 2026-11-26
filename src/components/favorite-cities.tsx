"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { useFavorites } from "@/hooks/use-favorites";
import { forecastUrl } from "@/lib/forecast-location";
import { FavoriteHeart } from "@/components/favorite-heart";
import type { Ciudad } from "@/lib/open-meteo/types";

function FavoriteCityCard({ city, onRemove }: { city: Ciudad; onRemove: () => void }) {
  const location = [city.region, city.pais].filter(Boolean).join(", ") || "Ubicación no disponible";

  return (
    <li
      className="feature-card group relative flex flex-col overflow-hidden rounded-[24px] border"
      style={{
        background: "var(--surface)",
        borderColor: "var(--line)",
      }}
    >
      {/* Acento visual de la marca */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{
          background: "linear-gradient(90deg, var(--accent), var(--aqua))",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-14 size-48 rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--aqua)" }}
      />

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: "var(--surface-soft)",
              color: "var(--accent)",
            }}
          >
            <Icon name="pin" className="size-6" />
          </span>

          <FavoriteHeart active label={`${city.nombre}, ${location}`} onClick={onRemove} />
        </div>

        <div className="mt-5 flex-1">
          <p
            className="text-[11px] font-bold tracking-[0.14em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            CIUDAD FAVORITA
          </p>

          <h3
            className="mt-2 text-[23px] leading-tight font-bold tracking-[-0.04em] break-words sm:text-[26px]"
            style={{ color: "var(--ink)" }}
          >
            {city.nombre}
          </h3>

          <p className="mt-2 text-sm leading-6 break-words" style={{ color: "var(--muted)" }}>
            {location}
          </p>
        </div>

        <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--line)" }}>
          <Link
            href={forecastUrl(city)}
            aria-label={`Ver pronóstico de ${city.nombre}, ${location}`}
            className="group/link flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm font-semibold transition-colors hover:bg-[var(--surface-soft)]"
            style={{ color: "var(--accent)" }}
          >
            <span>Consultar pronóstico</span>

            <Icon
              name="arrow"
              className="size-5 shrink-0 transition-transform group-hover/link:translate-x-1"
            />
          </Link>
        </div>
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

      <ul className="grid gap-4 sm:grid-cols-2">
        {favorites.cities.map((city) => (
          <FavoriteCityCard key={city.id} city={city} onRemove={() => favorites.remove(city)} />
        ))}
      </ul>

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

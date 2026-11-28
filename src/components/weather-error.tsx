"use client";

import Link from "next/link";

export function WeatherError({ retry }: { retry: () => void }) {
  return (
    <div role="alert" className="space-y-4 pt-12">
      <h1 className="text-2xl font-semibold" style={{ color: "var(--ink)" }}>
        No pudimos cargar el pronóstico
      </h1>
      <p style={{ color: "var(--muted)" }}>
        El servicio meteorológico no está disponible en este momento. Inténtalo de nuevo.
      </p>
      <button
        type="button"
        onClick={retry}
        className="min-h-11 rounded-xl px-5 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-[var(--accent)]"
        style={{ backgroundColor: "var(--ink)", color: "var(--page)" }}
      >
        Reintentar
      </button>
      <Link
        href="/"
        className="ml-4 inline-flex min-h-11 items-center font-semibold underline underline-offset-2 focus-visible:outline-[var(--accent)]"
        style={{ color: "var(--accent)" }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}

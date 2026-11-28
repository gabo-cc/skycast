import Link from "next/link";
import { Icon } from "@/components/icon";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center py-16 text-center sm:py-24">
      <div
        className="mb-7 flex size-20 items-center justify-center rounded-3xl border sm:size-24"
        style={{
          background: "var(--surface-soft)",
          borderColor: "var(--line)",
          color: "var(--accent)",
        }}
      >
        <Icon name="cloud" className="size-11 sm:size-12" />
      </div>
      <p className="text-sm font-bold tracking-[0.2em]" style={{ color: "var(--accent)" }}>
        404 · CIELO DESCONOCIDO
      </p>
      <h1
        className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl"
        style={{ color: "var(--ink)" }}
      >
        ¡Ups! Parece que te perdiste entre las nubes
      </h1>
      <p className="mt-5 max-w-lg text-base leading-7" style={{ color: "var(--muted)" }}>
        No encontramos la página que buscas. Verifica la dirección o regresa al inicio para seguir
        explorando el clima.
      </p>
      <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-[var(--accent)]"
          style={{ backgroundColor: "var(--ink)", color: "var(--page)" }}
        >
          Volver al inicio
        </Link>
        <Link
          href="/buscar"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-[var(--accent)]"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--line)",
            color: "var(--ink)",
          }}
        >
          Buscar una ciudad
        </Link>
      </div>
    </section>
  );
}

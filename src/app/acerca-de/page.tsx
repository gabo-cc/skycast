import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "Conoce SkyCast, una aplicación para consultar el clima, explorar pronósticos y comparar ciudades.",
};

const features = [
  {
    title: "Buscar ciudades",
    description: "Explora el clima en cualquier lugar.",
    icon: "search",
    href: "/buscar",
  },
  {
    title: "Guardar favoritas",
    description: "Mantén tus ciudades siempre cerca.",
    icon: "heart",
    href: "/favoritos",
  },
  {
    title: "Pronósticos detallados",
    description: "Consulta el tiempo por horas y días.",
    icon: "clock",
    href: "/pronostico",
  },
  {
    title: "Comparar ciudades",
    description: "Descubre las diferencias entre dos cielos.",
    icon: "compare",
    href: "/comparar",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 py-12 sm:py-16">
      <section className="mx-auto max-w-2xl text-center">
        <div
          className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl"
          style={{
            background: "var(--surface-soft)",
            color: "var(--accent)",
          }}
        >
          <Icon name="cloud" className="size-9" />
        </div>

        <p
          className="mb-3 text-xs font-bold tracking-[0.18em] uppercase"
          style={{ color: "var(--accent)" }}
        >
          CONOCE SKYCAST
        </p>

        <h1
          className="text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ color: "var(--ink)" }}
        >
          Una mirada más clara al cielo
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7" style={{ color: "var(--muted)" }}>
          SkyCast te permite consultar las condiciones meteorológicas actuales, explorar
          pronósticos, guardar tus lugares favoritos y comparar el clima entre distintas ciudades.
        </p>
      </section>

      <section aria-labelledby="funciones-titulo">
        <h2 id="funciones-titulo" className="sr-only">
          Explora las funcionalidades
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="feature-card group flex min-h-48 flex-col items-center justify-center rounded-3xl border p-5 text-center transition-colors"
              style={{
                background: "var(--surface)",
                borderColor: "var(--line)",
                color: "var(--ink)",
              }}
            >
              <div
                className="mb-4 flex size-14 items-center justify-center rounded-2xl transition-transform group-hover:-translate-y-1"
                style={{
                  background: "var(--surface-soft)",
                  color: "var(--accent)",
                }}
              >
                <Icon name={feature.icon} className="size-7" />
              </div>

              <h3 className="font-semibold">{feature.title}</h3>

              <p className="mt-2 text-xs leading-5" style={{ color: "var(--muted)" }}>
                {feature.description}
              </p>

              <span className="mt-4 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                Explorar →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="rounded-3xl border p-6 sm:p-8"
        style={{
          background: "var(--surface)",
          borderColor: "var(--line)",
        }}
      >
        <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
          Datos y tecnología
        </h2>

        <p className="mt-3 text-sm leading-7" style={{ color: "var(--muted)" }}>
          Los datos meteorológicos proceden de Open-Meteo. SkyCast está desarrollado con Next.js,
          React, TypeScript y Tailwind CSS mediante Vibe Coding.
        </p>
      </section>
    </div>
  );
}

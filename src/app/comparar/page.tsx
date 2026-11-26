import type { Metadata } from "next";
import { Comparison } from "@/components/comparison";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Comparar ciudades",
  description: "Compara las condiciones meteorológicas actuales entre dos ciudades con SkyCast.",
};

export default function CompararPage() {
  return (
    <div className="space-y-7 pt-6 pb-10 sm:space-y-8 sm:pt-9">
      <header>
        <div className="flex items-start gap-4">
          <span
            className="hidden size-13 shrink-0 items-center justify-center rounded-2xl sm:flex"
            style={{
              background: "var(--surface-soft)",
              color: "var(--accent)",
            }}
          >
            <Icon name="compare" className="size-6" />
          </span>

          <div>
            <p
              className="mb-2 text-[11px] font-bold tracking-[0.15em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              LADO A LADO
            </p>

            <h1
              className="text-3xl font-bold tracking-[-0.045em] sm:text-[38px]"
              style={{ color: "var(--ink)" }}
            >
              Compara dos cielos.
            </h1>

            <p
              className="mt-2 max-w-2xl text-sm leading-6 sm:text-base"
              style={{ color: "var(--muted)" }}
            >
              Dos ciudades, dos condiciones meteorológicas. Descubre sus diferencias de forma visual
              y sencilla.
            </p>
          </div>
        </div>
      </header>

      <Comparison />
    </div>
  );
}

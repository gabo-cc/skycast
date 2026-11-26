import type { Metadata } from "next";
import { FavoriteCities } from "@/components/favorite-cities";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Consulta y organiza tus ciudades favoritas en SkyCast.",
};

export default function FavoritosPage() {
  return (
    <div className="space-y-7 pt-6 pb-10 sm:space-y-8 sm:pt-9">
      <header className="relative">
        <div className="flex items-start gap-4">
          <div
            className="hidden size-13 shrink-0 items-center justify-center rounded-2xl sm:flex"
            style={{
              background: "var(--surface-soft)",
              color: "var(--favorite)",
            }}
          >
            <Icon name="heart" className="size-6" />
          </div>

          <div>
            <p
              className="mb-2 text-[11px] font-bold tracking-[0.15em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              TUS LUGARES
            </p>

            <h1
              className="text-3xl font-bold tracking-[-0.045em] sm:text-[38px]"
              style={{ color: "var(--ink)" }}
            >
              Tus cielos, siempre cerca.
            </h1>

            <p
              className="mt-2 max-w-2xl text-sm leading-6 sm:text-base"
              style={{ color: "var(--muted)" }}
            >
              Reúne tus ciudades favoritas en un solo lugar y accede a su pronóstico cuando lo
              necesites.
            </p>
          </div>
        </div>
      </header>

      <FavoriteCities />
    </div>
  );
}

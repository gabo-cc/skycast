import type { Metadata } from "next";
import { CitySearch } from "@/components/city-search";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Buscar ciudades",
  description:
    "Busca ciudades de todo el mundo y consulta sus condiciones meteorológicas en SkyCast.",
};

export default function BuscarPage() {
  return (
    <div className="space-y-7 pt-6 pb-10 sm:space-y-8 sm:pt-9">
      <header className="relative">
        <div className="flex items-start gap-4">
          <div
            className="hidden size-13 shrink-0 items-center justify-center rounded-2xl sm:flex"
            style={{
              background: "var(--surface-soft)",
              color: "var(--accent)",
            }}
          >
            <Icon name="pin" className="size-6" />
          </div>

          <div>
            <p
              className="mb-2 text-[11px] font-bold tracking-[0.15em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              EXPLORA EL MUNDO
            </p>

            <h1
              className="text-3xl font-bold tracking-[-0.045em] sm:text-[38px]"
              style={{ color: "var(--ink)" }}
            >
              Encuentra tu próximo cielo.
            </h1>

            <p
              className="mt-2 max-w-2xl text-sm leading-6 sm:text-base"
              style={{ color: "var(--muted)" }}
            >
              Desde tu ciudad hasta cualquier rincón del mundo. Busca un lugar y descubre qué tiempo
              hace allí.
            </p>
          </div>
        </div>
      </header>

      <CitySearch />
    </div>
  );
}

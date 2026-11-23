import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { DemoNotice, PageIntro, SectionHeading, WeatherCard } from "@/components/ui";
import { cities } from "@/lib/demo-weather";

export const metadata: Metadata = { title: "Buscar ciudades" };
export default function BuscarPage() {
  return (
    <div className="space-y-10 pt-12 sm:pt-16">
      <PageIntro
        eyebrow="Explora el mundo"
        title="Encuentra una ciudad"
        description="Cada lugar tiene su propio cielo. Aquí podrás buscar ciudades y descubrir sus condiciones."
      />
      <DemoNotice />
      <section
        aria-labelledby="buscar-titulo"
        className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
      >
        <h2 id="buscar-titulo" className="font-semibold text-slate-900">
          Búsqueda de ciudades
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          La búsqueda estará disponible en una próxima etapa.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-500">
          <Icon name="search" className="size-5 shrink-0" />
          <span className="text-sm">Busca por ciudad o país</span>
          <span className="ml-auto rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-500">
            Próximamente
          </span>
        </div>
      </section>
      <section className="space-y-5">
        <SectionHeading
          title="Ciudades de ejemplo"
          description="Una muestra de los resultados que podrás encontrar."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {cities.map((city) => (
            <WeatherCard key={city.city} city={city} />
          ))}
        </div>
      </section>
    </div>
  );
}

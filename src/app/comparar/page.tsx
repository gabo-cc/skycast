import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { DemoNotice, PageIntro, SectionHeading, WeatherCard } from "@/components/ui";
import { cities } from "@/lib/demo-weather";

export const metadata: Metadata = { title: "Comparar ciudades" };
export default function CompararPage() {
  return (
    <div className="space-y-10 pt-12 sm:pt-16">
      <PageIntro
        eyebrow="Lado a lado"
        title="Compara dos cielos"
        description="Dos destinos, una vista clara. Así podrás comparar sus condiciones de un vistazo."
      />
      <DemoNotice />
      <section className="space-y-5">
        <SectionHeading
          title="Comparación de ejemplo"
          description="La selección de ciudades estará disponible más adelante."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {cities.slice(0, 2).map((city) => (
            <WeatherCard key={city.city} city={city} />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              label: "Humedad",
              icon: "drop" as const,
              unit: "%",
              values: cities.slice(0, 2).map((city) => city.humidity),
            },
            {
              label: "Viento",
              icon: "wind" as const,
              unit: " km/h",
              values: cities.slice(0, 2).map((city) => city.wind),
            },
          ].map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Icon name={metric.icon} className="size-4 text-sky-700" />
                {metric.label}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {metric.values.map((value, index) => (
                  <div key={cities[index].city}>
                    <p className="text-xs text-slate-500">{cities[index].city}</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">
                      {value}
                      {metric.unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

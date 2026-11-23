import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import type { CityWeather } from "@/lib/demo-weather";

export function DemoNotice() {
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
      <Icon name="spark" className="mt-1 size-4 shrink-0" />
      <p>
        <strong>Vista de demostración.</strong> Los datos son ilustrativos y no representan el
        tiempo actual.
      </p>
    </div>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-xs font-bold tracking-[0.2em] text-sky-700 uppercase">{eyebrow}</p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p>
    </div>
  );
}
export function SectionHeading({
  title,
  description,
  aside,
}: {
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {aside}
    </div>
  );
}
export function WeatherCard({ city }: { city: CityWeather }) {
  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_40px_-24px_rgba(30,64,100,0.25)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {city.country}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{city.city}</h3>
        </div>
        <span className="rounded-2xl bg-sky-50 p-3 text-sky-700">
          <Icon name={city.icon} className="size-7" />
        </span>
      </div>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-4xl font-semibold tracking-tight text-slate-900">
            {city.temperature}°
          </p>
          <p className="mt-2 text-sm text-slate-500">{city.condition}</p>
        </div>
        <p className="text-sm text-slate-500">
          Máx. {city.high}° <span className="mx-1 text-slate-300">/</span> Mín. {city.low}°
        </p>
      </div>
    </article>
  );
}

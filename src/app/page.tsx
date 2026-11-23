import Link from "next/link";
import { Icon } from "@/components/icon";
import { DemoNotice, SectionHeading, WeatherCard } from "@/components/ui";
import { cities } from "@/lib/demo-weather";

export default function Home() {
  const city = cities[0];
  return (
    <div className="space-y-10 pt-10 sm:pt-14">
      <section className="rounded-[2rem] bg-[#dceef6] px-5 py-8 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold tracking-wider text-sky-800 uppercase">
              <Icon name="spark" className="size-4" /> Una nueva perspectiva del clima
            </p>
            <h1 className="text-5xl leading-[1.08] font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Tu cielo,
              <br />
              <span className="text-sky-700">más claro.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600 sm:text-lg">
              Descubre lo que el cielo tiene preparado y planea tus días con una mirada más
              tranquila.
            </p>
            <Link
              href="/buscar"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-800"
            >
              Explorar ciudades <Icon name="arrow" className="size-4" />
            </Link>
          </div>
          <div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-7 shadow-[0_20px_60px_-25px_rgba(38,88,112,0.35)] backdrop-blur-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                  <Icon name="pin" className="size-4" /> {city.city}, {city.country}
                </p>
                <p className="mt-2 text-xs font-semibold tracking-wider text-sky-700 uppercase">
                  Ejemplo ilustrativo
                </p>
              </div>
              <Icon name="cloud" className="size-14 text-sky-600" />
            </div>
            <div className="mt-9 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-7xl font-light tracking-tighter text-slate-900">
                  {city.temperature}°
                </p>
                <p className="mt-2 text-sm text-slate-600">{city.condition}</p>
              </div>
              <p className="text-sm text-slate-500">
                Máx. {city.high}° &nbsp; / &nbsp; Mín. {city.low}°
              </p>
            </div>
            <div className="mt-8 grid gap-3 border-t border-slate-200 pt-5 text-sm text-slate-600 sm:grid-cols-2">
              <span className="flex items-center gap-2">
                <Icon name="drop" className="size-4 text-sky-600" /> Humedad {city.humidity}%
              </span>
              <span className="flex items-center gap-2">
                <Icon name="wind" className="size-4 text-sky-600" /> Viento {city.wind} km/h
              </span>
            </div>
          </div>
        </div>
      </section>
      <DemoNotice />
      <section className="space-y-5">
        <SectionHeading
          title="Un vistazo a otras ciudades"
          description="Explora ejemplos de cómo se verá el tiempo en diferentes lugares."
          aside={
            <Link
              href="/buscar"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"
            >
              Ver ciudades <Icon name="arrow" className="size-4" />
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {cities.map((item) => (
            <WeatherCard key={item.city} city={item} />
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/pronostico"
          className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-sky-300"
        >
          <Icon name="clock" className="mb-5 size-6 text-sky-700" />
          <h2 className="font-semibold text-slate-900">
            Mira un poco más adelante <span className="text-sky-700">↗</span>
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Conoce la estructura de los pronósticos por hora y por día.
          </p>
        </Link>
        <Link
          href="/comparar"
          className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:border-sky-300"
        >
          <Icon name="compare" className="mb-5 size-6 text-sky-700" />
          <h2 className="font-semibold text-slate-900">
            Dos lugares, una mirada <span className="text-sky-700">↗</span>
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Descubre cómo podrás comparar ciudades lado a lado.
          </p>
        </Link>
      </section>
    </div>
  );
}

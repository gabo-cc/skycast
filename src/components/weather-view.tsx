import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/ui";
import { condicion, fechaLocal, valor } from "@/lib/weather-display";
import type { Ciudad, Clima } from "@/lib/open-meteo/types";

export function CurrentWeather({ city, weather }: { city: Ciudad; weather: Clima }) {
  const current = weather.actual;
  const condition = condicion(current?.codigoMeteorologico ?? null, current?.esDeDia ?? null);
  return (
    <section
      aria-labelledby="actual-titulo"
      className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-600">
            {[city.region, city.pais].filter(Boolean).join(", ") || "Ubicación seleccionada"}
          </p>
          <h2 id="actual-titulo" className="mt-1 text-2xl font-semibold text-slate-900">
            {city.nombre}
          </h2>
          <p className="mt-2 text-xs text-slate-600">
            Hora del dato: {fechaLocal(current?.hora ?? null, true)} · {weather.zonaHoraria}
          </p>
        </div>
        <Icon name={condition.icono} className="size-12 shrink-0 text-sky-700" />
      </div>
      {current ? (
        <>
          <p className="mt-6 text-5xl font-semibold tracking-tight text-slate-900">
            {valor(current.temperatura, "°C")}
          </p>
          <p className="mt-2 text-slate-600">{condition.descripcion}</p>
          <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">Sensación térmica</dt>
              <dd className="mt-1 font-semibold">{valor(current.sensacionTermica, "°C")}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Humedad</dt>
              <dd className="mt-1 font-semibold">{valor(current.humedad, "%")}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Viento</dt>
              <dd className="mt-1 font-semibold">{valor(current.viento, " km/h")}</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="mt-5 text-slate-600">Las condiciones actuales no están disponibles.</p>
      )}
    </section>
  );
}

export function HourlyForecast({ weather }: { weather: Clima }) {
  const now = weather.actual?.hora;
  const hours = (
    now ? weather.horas.filter((hour) => hour.hora >= now.slice(0, 13)) : weather.horas
  ).slice(0, 24);
  return (
    <section className="space-y-5">
      <SectionHeading
        title="Pronóstico por horas"
        description={`Horas locales del proveedor · ${weather.zonaHoraria}`}
      />
      {hours.length ? (
        <div
          tabIndex={0}
          role="region"
          aria-label="Pronóstico por horas, desplazable horizontalmente"
          className="flex gap-3 overflow-x-auto pb-3"
        >
          {hours.map((hour) => {
            const condition = condicion(hour.codigoMeteorologico);
            return (
              <article
                key={hour.hora}
                className="w-36 shrink-0 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-xs text-slate-600">{fechaLocal(hour.hora, true)}</p>
                <Icon name={condition.icono} className="my-4 size-7 text-sky-700" />
                <p className="text-xl font-semibold">{valor(hour.temperatura, "°C")}</p>
                <p className="mt-2 text-xs text-slate-600">{condition.descripcion}</p>
                <p className="mt-2 text-xs text-slate-600">
                  Precipitación: {valor(hour.probabilidadPrecipitacion, "%")}
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-600">No hay datos horarios disponibles.</p>
      )}
    </section>
  );
}

export function DailyForecast({ weather, limit }: { weather: Clima; limit?: number }) {
  const days = weather.dias.slice(0, limit ?? 7);
  return (
    <section className="space-y-5">
      <SectionHeading
        title={limit ? "Resumen del pronóstico" : "Próximos siete días"}
        description={`Fechas locales del proveedor · ${weather.zonaHoraria}`}
      />
      {days.length ? (
        <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white px-5">
          {days.map((day) => {
            const condition = condicion(day.codigoMeteorologico);
            return (
              <article
                key={day.fecha}
                className="grid gap-2 py-4 sm:grid-cols-[1fr_1.5fr_1fr] sm:items-center"
              >
                <h3 className="font-semibold">{fechaLocal(day.fecha)}</h3>
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon name={condition.icono} className="size-6 shrink-0 text-sky-700" />{" "}
                  {condition.descripcion}
                </p>
                <p className="text-sm text-slate-700">
                  Máx. {valor(day.temperaturaMaxima, "°C")} · Mín.{" "}
                  {valor(day.temperaturaMinima, "°C")} · Lluvia{" "}
                  {valor(day.probabilidadPrecipitacionMaxima, "%")}
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="text-slate-600">No hay pronóstico diario disponible.</p>
      )}
    </section>
  );
}

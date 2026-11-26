import { Icon } from "@/components/icon";
import { SectionHeading } from "@/components/ui";
import { WeatherAtmosphere } from "@/components/weather-atmosphere";
import { condicion, estiloClima, fechaLocal, instanteLocal, valor } from "@/lib/weather-display";
import type { Ciudad, Clima } from "@/lib/open-meteo/types";

/* =========================================
   CLIMA ACTUAL
   ========================================= */

export function CurrentWeather({ city, weather }: { city: Ciudad; weather: Clima }) {
  const current = weather.actual;

  const condition = condicion(current?.codigoMeteorologico ?? null, current?.esDeDia ?? null);

  return (
    <section
      aria-labelledby="actual-titulo"
      className={`weather-hero atmosphere-container ${estiloClima(
        current?.codigoMeteorologico ?? null,
        current?.esDeDia ?? null,
      )}`}
    >
      <WeatherAtmosphere
        code={current?.codigoMeteorologico ?? null}
        isDay={current?.esDeDia ?? null}
      />

      <div className="weather-hero-content atmosphere-content">
        <div className="weather-hero-top">
          <div>
            <p className="weather-eyebrow">
              <Icon name="pin" className="size-4" />
              El tiempo en
            </p>

            <h2 id="actual-titulo" className="weather-city">
              {city.nombre}
            </h2>

            {city.pais && <p className="weather-country">{city.pais}</p>}
          </div>

          <span className="weather-live-label">Condiciones actuales</span>
        </div>

        {current ? (
          <>
            <div className="weather-hero-main">
              <div className="weather-temperature-block">
                <div className="weather-temperature-row">
                  <span className="weather-temperature">{valor(current.temperatura, "°C")}</span>
                </div>

                <div className="weather-condition">
                  <Icon name={condition.icono} className="size-7 shrink-0" />

                  <span>{condition.descripcion}</span>
                </div>
              </div>
            </div>

            <div className="weather-hero-bottom">
              <dl className="weather-metrics">
                <div className="weather-metric">
                  <dt>Sensación térmica</dt>
                  <dd>{valor(current.sensacionTermica, "°C")}</dd>
                </div>

                <div className="weather-metric">
                  <dt>Humedad</dt>
                  <dd>{valor(current.humedad, "%")}</dd>
                </div>

                <div className="weather-metric">
                  <dt>Viento</dt>
                  <dd>{valor(current.viento, " km/h")}</dd>
                </div>
              </dl>

              <p className="weather-update">
                Última actualización: {instanteLocal(current.hora, weather.zonaHoraria)}
              </p>
            </div>
          </>
        ) : (
          <div className="weather-unavailable">
            <p>Las condiciones actuales no están disponibles.</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================
   PRONÓSTICO POR HORAS
   ========================================= */

export function HourlyForecast({ weather, limit = 24 }: { weather: Clima; limit?: number }) {
  const now = weather.actual?.hora;

  const parsedNow = now ? Date.parse(now) : NaN;

  const currentHour = Number.isFinite(parsedNow)
    ? Math.floor(parsedNow / 3_600_000) * 3_600_000
    : null;

  const hours = (
    currentHour !== null
      ? weather.horas.filter((hour) => Date.parse(hour.hora) >= currentHour)
      : weather.horas
  ).slice(0, limit);

  const compact = hours.length <= 8;

  const labels = hours.map((hour) => {
    const date = new Date(hour.hora);

    if (!Number.isFinite(date.getTime())) {
      return {
        time: "--:--",
        date: "",
        offset: "",
      };
    }

    try {
      const parts = new Intl.DateTimeFormat("es-419", {
        timeZone: weather.zonaHoraria,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZoneName: "shortOffset",
      }).formatToParts(date);

      const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";

      return {
        time: `${part("hour")}:${part("minute")}`,
        date: `${part("year")}-${part("month")}-${part("day")}`,
        offset: part("timeZoneName"),
      };
    } catch {
      return {
        time: "--:--",
        date: "",
        offset: "",
      };
    }
  });

  const counts = new Map<string, number>();

  for (const label of labels) {
    const key = `${label.date}|${label.time}`;

    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return (
    <section className="weather-section">
      {hours.length > 0 ? (
        <div className="hourly-panel">
          <div
            tabIndex={0}
            role="region"
            aria-label="Pronóstico por horas, desplazable horizontalmente"
            className={`hourly-scroll ${compact ? "hourly-scroll-fill" : ""}`}
          >
            {hours.map((hour, index) => {
              const condition = condicion(hour.codigoMeteorologico, hour.esDeDia ?? null);

              const label = labels[index];

              const repeated = (counts.get(`${label.date}|${label.time}`) ?? 0) > 1;

              return (
                <article
                  key={hour.hora}
                  className={`hourly-item ${index === 0 ? "hourly-item-first" : ""}`}
                  title={instanteLocal(hour.hora, weather.zonaHoraria)}
                >
                  <div className="hourly-time">
                    <span>{label.time}</span>

                    {repeated && <span className="block text-[10px]">{label.offset}</span>}
                  </div>

                  <div className="hourly-icon">
                    <Icon name={condition.icono} className="size-7" />
                  </div>

                  <p className="hourly-temperature">{valor(hour.temperatura, "°C")}</p>

                  <p className="hourly-condition">{condition.descripcion}</p>

                  <p className="hourly-rain">
                    <Icon name="rain" className="size-4 shrink-0" />

                    {valor(hour.probabilidadPrecipitacion, "%")}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="weather-empty">No hay datos horarios disponibles.</p>
      )}
    </section>
  );
}

/* =========================================
   PRONÓSTICO DIARIO
   ========================================= */

export function DailyForecast({ weather, limit }: { weather: Clima; limit?: number }) {
  const days = weather.dias.slice(0, limit ?? 7);

  return (
    <section className="weather-section">
      <SectionHeading
        title={limit ? "Resumen del pronóstico" : "Próximos siete días"}
        description={`Previsión diaria · ${weather.zonaHoraria}`}
      />

      {days.length > 0 ? (
        <div className="daily-panel">
          {days.map((day) => {
            const condition = condicion(day.codigoMeteorologico);

            return (
              <article key={day.fecha} className="daily-item">
                <div className="daily-date">
                  <h3>{fechaLocal(day.fecha)}</h3>

                  <p className="daily-description">{condition.descripcion}</p>
                </div>

                <div className="daily-icon">
                  <Icon name={condition.icono} className="size-7" />
                </div>

                <div className="daily-values">
                  <div className="daily-temperatures">
                    <span className="daily-max">{valor(day.temperaturaMaxima, "°C")}</span>

                    <span className="daily-min">{valor(day.temperaturaMinima, "°C")}</span>
                  </div>

                  <p className="daily-precipitation">
                    <Icon name="rain" className="size-4 shrink-0" />

                    {valor(day.probabilidadPrecipitacionMaxima, "%")}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="weather-empty">No hay pronóstico diario disponible.</p>
      )}
    </section>
  );
}

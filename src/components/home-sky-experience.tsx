"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { WeatherAtmosphere } from "@/components/weather-atmosphere";
import { forecastUrl } from "@/lib/forecast-location";
import { horasDeInicio, lecturaDeInicio } from "@/lib/home-weather";
import { condicion, instanteLocal, valor } from "@/lib/weather-display";
import type { Ciudad, Clima } from "@/lib/open-meteo/types";

function horaLocal(instant: string, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("es-419", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(new Date(instant));
  } catch {
    return "--:--";
  }
}

export function HomeSkyExperience({ city, weather }: { city: Ciudad; weather: Clima }) {
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const current = weather.actual;
  const hours = horasDeInicio(weather);
  const { selected, reading } = lecturaDeInicio(weather, selectedHour);
  const condition = condicion(reading?.codigoMeteorologico ?? null, reading?.esDeDia ?? null);
  const sceneKey = `${reading?.codigoMeteorologico ?? "unknown"}:${reading?.esDeDia ?? "unknown"}`;

  return (
    <div className="home-experience">
      <section className="home-scene atmosphere-container" aria-labelledby="home-scene-city">
        <div key={sceneKey} className="home-scene-background">
          <WeatherAtmosphere
            code={reading?.codigoMeteorologico ?? null}
            isDay={reading?.esDeDia ?? null}
          />
        </div>
        <div className="home-scene-content atmosphere-content">
          <div className="home-scene-location">
            <p className="home-scene-kicker">
              <Icon name="pin" className="size-4" /> TU CIELO EN
            </p>
            <h2 id="home-scene-city">{city.nombre}</h2>
            {city.pais && <p>{city.pais}</p>}
          </div>

          <div className="home-scene-reading" aria-live="polite" aria-atomic="true">
            <p className="home-scene-time">
              {selected ? "Pronóstico" : "Ahora"} ·{" "}
              {instanteLocal(reading?.hora ?? null, weather.zonaHoraria)}
            </p>
            {reading ? (
              <>
                <div className="home-scene-temperature">{valor(reading.temperatura, "°C")}</div>
                <p className="home-scene-condition">
                  <Icon name={condition.icono} className="size-7" /> {condition.descripcion}
                </p>
              </>
            ) : (
              <p className="home-scene-unavailable">
                Las condiciones actuales no están disponibles.
              </p>
            )}
          </div>

          <div className="home-scene-details">
            <p className="home-scene-details-label">
              {selected ? "Condiciones actuales" : "En este momento"}
            </p>
            <dl className="home-scene-metrics">
              <div>
                <dt>Sensación térmica</dt>
                <dd>{valor(current?.sensacionTermica ?? null, "°C")}</dd>
              </div>
              <div>
                <dt>Humedad</dt>
                <dd>{valor(current?.humedad ?? null, "%")}</dd>
              </div>
              <div>
                <dt>Viento</dt>
                <dd>{valor(current?.viento ?? null, " km/h")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="home-hours" aria-labelledby="home-hours-title">
        <div className="home-hours-header">
          <div>
            <p className="home-hours-kicker">EXPLORA EL DÍA</p>
            <h2 id="home-hours-title">El cielo, hora a hora</h2>
            <p>Selecciona una hora · {weather.zonaHoraria}</p>
          </div>
          <Link className="home-hours-link" href={forecastUrl(city)}>
            Ver pronóstico completo <Icon name="arrow" className="size-4" />
          </Link>
        </div>
        <div
          className="home-hours-scroll"
          role="region"
          tabIndex={0}
          aria-label="Horas del pronóstico, desplazable horizontalmente"
        >
          <button
            type="button"
            className="home-hour"
            aria-pressed={!selected}
            onClick={() => setSelectedHour(null)}
          >
            <span>Ahora</span>
            <Icon
              name={condicion(current?.codigoMeteorologico ?? null, current?.esDeDia ?? null).icono}
              className="size-7"
            />
            <strong>{valor(current?.temperatura ?? null, "°C")}</strong>
            <small>Actual</small>
          </button>
          {hours.map((hour) => {
            const hourCondition = condicion(hour.codigoMeteorologico, hour.esDeDia ?? null);
            return (
              <button
                type="button"
                className="home-hour"
                key={hour.hora}
                aria-pressed={selected?.hora === hour.hora}
                aria-label={`${horaLocal(hour.hora, weather.zonaHoraria)} ${valor(hour.temperatura, "°C")} ${valor(hour.probabilidadPrecipitacion, "%")}. ${instanteLocal(hour.hora, weather.zonaHoraria)}, ${hourCondition.descripcion}, probabilidad de precipitación ${valor(hour.probabilidadPrecipitacion, "%")}`}
                title={instanteLocal(hour.hora, weather.zonaHoraria)}
                onClick={() => setSelectedHour(hour.hora)}
              >
                <span>{horaLocal(hour.hora, weather.zonaHoraria)}</span>{" "}
                <Icon name={hourCondition.icono} className="size-7" />
                <strong>{valor(hour.temperatura, "°C")}</strong>
                <small>
                  <Icon name="drop" className="size-3" />{" "}
                  {valor(hour.probabilidadPrecipitacion, "%")}
                </small>
              </button>
            );
          })}
        </div>
        {hours.length === 0 && (
          <p className="home-hours-empty">No hay datos horarios disponibles.</p>
        )}
      </section>
    </div>
  );
}

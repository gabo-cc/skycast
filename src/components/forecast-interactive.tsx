"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/icon";
import { ForecastSkyScene } from "@/components/forecast-sky-scene";
import type { Clima } from "@/lib/open-meteo/types";
import { condicion, fechaLocal, valor } from "@/lib/weather-display";
import { diaSeleccionado } from "@/lib/forecast-view";
import { graficaTemperaturas } from "@/lib/forecast-chart";
import { repeatedLocalHours, weatherHourLabel } from "@/lib/weather-time";

type ForecastProps = {
  weather: Clima;
};

type Point = {
  x: number;
  y: number;
};

function formatPoints(points: Point[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function TemperatureChart({
  hours,
  selectedIndex,
  timeZone,
  onSelect,
}: {
  hours: Clima["horas"];
  selectedIndex: number;
  timeZone: string;
  onSelect: (index: number) => void;
}) {
  const gradientId = useId().replace(/:/g, "");
  const chart = graficaTemperaturas(hours);

  if (!chart) {
    return (
      <div
        className="flex min-h-36 items-center justify-center rounded-2xl text-sm"
        style={{
          background: "var(--surface-soft)",
          color: "var(--muted)",
        }}
      >
        No hay temperaturas para representar.
      </div>
    );
  }

  const { min, max, points, segments } = chart;
  const selectedPoint = points[selectedIndex];
  const repeatedHours = repeatedLocalHours(hours, timeZone);

  return (
    <div className="forecast-chart">
      <div className="mb-1 flex items-center justify-between gap-3 px-3">
        <span
          className="text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: "var(--muted)" }}
        >
          Evolución de temperatura
        </span>

        <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--accent)" }}>
          {valor(min, "°")} – {valor(max, "°")}
        </span>
      </div>

      <div
        className="forecast-chart-scroll"
        role="region"
        tabIndex={0}
        aria-label="Gráfica horaria desplazable"
      >
        <div
          className="forecast-chart-plot"
          style={{ minWidth: `${Math.max(hours.length * 64, 480)}px` }}
        >
          <svg
            viewBox="0 0 100 65"
            preserveAspectRatio="none"
            className="forecast-chart-svg"
            role="img"
            aria-label={`Evolución de la temperatura. Mínima ${min} grados Celsius y máxima ${max} grados Celsius. Los huecos indican datos ausentes.`}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--aqua)" stopOpacity="0.34" />
                <stop offset="100%" stopColor="var(--aqua)" stopOpacity="0.015" />
              </linearGradient>
            </defs>

            {[18, 35, 52].map((y) => (
              <line
                key={y}
                x1="5"
                x2="95"
                y1={y}
                y2={y}
                stroke="var(--line)"
                strokeWidth="0.65"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {segments.map((segment, index) => {
              if (segment.length < 2) return null;

              const first = segment[0];
              const last = segment[segment.length - 1];

              return (
                <polygon
                  key={`area-${index}`}
                  points={`${formatPoints(segment)} ${last.x},57 ${first.x},57`}
                  fill={`url(#${gradientId})`}
                />
              );
            })}

            {segments.map((segment, index) => (
              <polyline
                key={`line-${index}`}
                className="forecast-chart-line"
                points={formatPoints(segment)}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {selectedPoint && (
              <line
                x1={selectedPoint.x}
                x2={selectedPoint.x}
                y1="12"
                y2="57"
                stroke="var(--accent)"
                strokeOpacity="0.55"
                strokeDasharray="3 4"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
          {points.map((point, index) => {
            if (!point) return null;
            const item = hours[index];
            const label = weatherHourLabel(item.hora, timeZone);
            const condition = condicion(item.codigoMeteorologico, item.esDeDia ?? null);
            return (
              <button
                key={item.hora}
                type="button"
                className="forecast-chart-point"
                style={{ left: `${point.x}%`, top: `${(point.y / 65) * 100}%` }}
                aria-label={`Seleccionar ${label.full}: ${valor(item.temperatura, "°C")}, ${condition.descripcion}`}
                aria-pressed={index === selectedIndex}
                title={`${label.full} · ${valor(item.temperatura, "°C")}`}
                onClick={() => onSelect(index)}
              >
                <span aria-hidden="true" />
              </button>
            );
          })}
          {hours.map((item, index) => {
            const label = weatherHourLabel(item.hora, timeZone);
            const x = hours.length < 2 ? 50 : 5 + (index * 90) / (hours.length - 1);
            return (
              <span
                className="forecast-chart-tick"
                key={item.hora}
                style={{ left: `${x}%` }}
                aria-hidden="true"
              >
                {label.time}
                {repeatedHours.has(`${label.date}|${label.time}`) && <small>{label.offset}</small>}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ForecastInteractive({ weather }: ForecastProps) {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [view, setView] = useState<"hours" | "days">("hours");

  const now = weather.actual?.hora ? Date.parse(weather.actual.hora) : NaN;

  const currentHour = Number.isFinite(now) ? Math.floor(now / 3_600_000) * 3_600_000 : null;

  const hours = (
    currentHour === null
      ? weather.horas
      : weather.horas.filter((hour) => Date.parse(hour.hora) >= currentHour)
  ).slice(0, 24);

  const days = weather.dias.slice(0, 7);

  const activeHourIndex = Math.min(selectedHour, Math.max(0, hours.length - 1));

  const activeDayIndex = Math.min(selectedDay, Math.max(0, days.length - 1));

  const hour = hours[activeHourIndex];
  const day = diaSeleccionado(days, activeDayIndex);

  const activeCondition = condicion(hour?.codigoMeteorologico ?? null, hour?.esDeDia ?? null);

  const activeLabel = hour ? weatherHourLabel(hour.hora, weather.zonaHoraria) : null;

  const repeatedHours = repeatedLocalHours(hours, weather.zonaHoraria);

  const firstDate = hours.length ? weatherHourLabel(hours[0].hora, weather.zonaHoraria).date : null;

  return (
    <div className="space-y-6">
      {/* Selector de vista */}

      <div
        role="group"
        aria-label="Vista del pronóstico"
        className="flex gap-2 border-b"
        style={{ borderColor: "var(--line)" }}
      >
        {(
          [
            ["hours", "Por hora"],
            ["days", "7 días"],
          ] as const
        ).map(([value, title]) => {
          const active = view === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => setView(value)}
              aria-pressed={active}
              className="min-h-11 border-b-2 px-5 text-sm font-semibold transition-colors"
              style={{
                borderColor: active ? "var(--aqua)" : "transparent",
                color: active ? "var(--accent)" : "var(--muted)",
              }}
            >
              {title}
            </button>
          );
        })}
      </div>

      {/* =====================================
          PRONÓSTICO POR HORAS
      ===================================== */}

      {view === "hours" && (
        <section aria-labelledby="horas-titulo" className="space-y-4">
          <div>
            <p
              className="text-[11px] font-bold tracking-[0.15em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              PRÓXIMAS HORAS
            </p>

            <h2
              id="horas-titulo"
              className="mt-2 text-2xl font-bold tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              El clima, hora a hora
            </h2>

            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Horario local · {weather.zonaHoraria}
            </p>
          </div>

          {hours.length > 0 ? (
            <div
              className="overflow-hidden rounded-[26px] border p-4 shadow-sm sm:p-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--line)",
              }}
            >
              {/* Condiciones seleccionadas */}

              <div className="forecast-selected">
                <div
                  className="forecast-selected-sky"
                  key={`${hour?.codigoMeteorologico}:${hour?.esDeDia}`}
                  aria-hidden="true"
                >
                  <ForecastSkyScene
                    code={hour?.codigoMeteorologico ?? null}
                    isDay={hour?.esDeDia ?? null}
                  />
                </div>
                <div className="forecast-selected-content" aria-live="polite" aria-atomic="true">
                  <div>
                    <p className="forecast-selected-label">PRONÓSTICO PARA</p>
                    <p className="forecast-selected-time">{activeLabel?.full}</p>
                    <p className="forecast-selected-temperature">
                      {valor(hour?.temperatura ?? null, "°C")}
                    </p>
                    <p className="forecast-selected-condition">
                      <Icon name={activeCondition.icono} className="size-7" />{" "}
                      {activeCondition.descripcion}
                    </p>
                  </div>
                  <div className="forecast-selected-rain">
                    <span>
                      <Icon name="rain" className="size-5" /> Probabilidad de precipitación
                    </span>
                    <strong>{valor(hour?.probabilidadPrecipitacion ?? null, "%")}</strong>
                  </div>
                </div>
              </div>

              <TemperatureChart
                hours={hours}
                selectedIndex={activeHourIndex}
                timeZone={weather.zonaHoraria}
                onSelect={setSelectedHour}
              />

              {/* Selector de horas */}

              <div
                role="group"
                aria-label="Seleccionar hora del pronóstico"
                className="mt-4 flex gap-2 overflow-x-auto pb-3"
              >
                {hours.map((item, index) => {
                  const label = weatherHourLabel(item.hora, weather.zonaHoraria);

                  const previousLabel =
                    index > 0 ? weatherHourLabel(hours[index - 1].hora, weather.zonaHoraria) : null;

                  const startsNewDay = previousLabel !== null && previousLabel.date !== label.date;

                  const repeatedKey = `${label.date}|${label.time}`;

                  const isRepeated = repeatedHours.has(repeatedKey);

                  const active = index === activeHourIndex;

                  const condition = condicion(item.codigoMeteorologico, item.esDeDia ?? null);

                  return (
                    <div key={item.hora} className="flex shrink-0 flex-col justify-end">
                      {startsNewDay ? (
                        <span
                          className="mb-1 text-center text-[10px] font-semibold"
                          style={{
                            color: "var(--accent)",
                          }}
                        >
                          Día siguiente
                        </span>
                      ) : (
                        <span className="mb-1 h-3" />
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedHour(index)}
                        aria-pressed={active}
                        aria-label={`Seleccionar ${label.full}`}
                        className="flex min-h-19 min-w-19 flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-semibold transition-all hover:-translate-y-0.5"
                        style={{
                          background: active ? "var(--accent)" : "var(--surface-soft)",
                          borderColor: active ? "var(--accent)" : "var(--line)",
                          color: active ? "#ffffff" : "var(--ink)",
                        }}
                      >
                        <span className="text-sm tabular-nums">{label.time}</span>

                        <Icon name={condition.icono} className="size-5" />

                        {isRepeated && (
                          <span className="text-[10px] font-normal">{label.offset}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <p className="mt-2 text-xs leading-5" style={{ color: "var(--muted)" }}>
                Selecciona una hora para consultar sus condiciones. Los horarios se muestran según
                la zona horaria de la ciudad.
              </p>

              {firstDate && (
                <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                  Inicio del período: {firstDate}. Las horas repetidas por cambios de horario
                  incluyen su desplazamiento UTC.
                </p>
              )}
            </div>
          ) : (
            <p style={{ color: "var(--muted)" }}>No hay datos horarios disponibles.</p>
          )}
        </section>
      )}

      {/* =====================================
          PRONÓSTICO DE SIETE DÍAS
      ===================================== */}

      {view === "days" && (
        <section aria-labelledby="dias-titulo" className="space-y-5">
          <div>
            <p
              className="text-[11px] font-bold tracking-[0.15em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              PRÓXIMOS DÍAS
            </p>

            <h2
              id="dias-titulo"
              className="mt-2 text-2xl font-bold tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              Tu semana en el cielo
            </h2>

            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Explora las temperaturas y condiciones de los próximos siete días.
            </p>
          </div>

          {days.length > 0 ? (
            <div className="grid items-start gap-4 lg:grid-cols-[1.25fr_1fr]">
              {/* Lista de días */}

              <div
                role="group"
                aria-label="Seleccionar día del pronóstico"
                className="forecast-days-grid"
              >
                {days.map((item, index) => {
                  const condition = condicion(item.codigoMeteorologico);

                  const active = index === activeDayIndex;

                  return (
                    <button
                      key={item.fecha}
                      type="button"
                      onClick={() => setSelectedDay(index)}
                      aria-pressed={active}
                      className="forecast-day-card"
                    >
                      <span className="forecast-day-top">
                        <span className="forecast-day-date">{fechaLocal(item.fecha)}</span>
                        <Icon name={condition.icono} className="size-6" />
                      </span>
                      <span className="forecast-day-condition">{condition.descripcion}</span>
                      <span className="forecast-day-values">
                        <span>
                          <span className="sr-only">Máxima </span>
                          <strong>{valor(item.temperaturaMaxima, "°C")}</strong>
                        </span>
                        <span>
                          <span className="sr-only">Mínima </span>
                          {valor(item.temperaturaMinima, "°C")}
                        </span>
                      </span>
                      <span className="forecast-day-rain">
                        <Icon name="drop" className="size-4" />
                        <span className="sr-only">Probabilidad máxima de precipitación </span>
                        {valor(item.probabilidadPrecipitacionMaxima, "%")}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Detalle del día seleccionado */}

              {day && (
                <div
                  aria-live="polite"
                  aria-atomic="true"
                  className="overflow-hidden rounded-[24px] border shadow-sm"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--line)",
                  }}
                >
                  <div
                    className="p-5 sm:p-6"
                    style={{
                      background: "var(--surface-soft)",
                    }}
                  >
                    <p
                      className="text-[11px] font-bold tracking-[0.14em] uppercase"
                      style={{
                        color: "var(--accent)",
                      }}
                    >
                      DETALLE DEL DÍA
                    </p>

                    <h3
                      className="mt-2 text-2xl font-bold tracking-tight"
                      style={{ color: "var(--ink)" }}
                    >
                      {fechaLocal(day.fecha)}
                    </h3>

                    <div className="mt-5 flex items-center gap-4">
                      <span
                        className="flex size-16 items-center justify-center rounded-2xl"
                        style={{
                          background: "var(--surface)",
                          color: "var(--accent)",
                        }}
                      >
                        <Icon name={condicion(day.codigoMeteorologico).icono} className="size-9" />
                      </span>

                      <p
                        className="text-sm font-medium"
                        style={{
                          color: "var(--ink)",
                        }}
                      >
                        {condicion(day.codigoMeteorologico).descripcion}
                      </p>
                    </div>
                  </div>

                  <dl className="space-y-1 p-5 sm:p-6">
                    {[
                      {
                        label: "Máxima",
                        value: valor(day.temperaturaMaxima, "°C"),
                      },
                      {
                        label: "Mínima",
                        value: valor(day.temperaturaMinima, "°C"),
                      },
                      {
                        label: "Probabilidad máxima de lluvia",
                        value: valor(day.probabilidadPrecipitacionMaxima, "%"),
                      },
                    ].map((metric) => (
                      <div
                        key={metric.label}
                        className="flex min-h-14 items-center justify-between gap-4 border-b py-3 last:border-b-0"
                        style={{
                          borderColor: "var(--line)",
                        }}
                      >
                        <dt
                          className="text-sm"
                          style={{
                            color: "var(--muted)",
                          }}
                        >
                          {metric.label}
                        </dt>

                        <dd
                          className="text-sm font-bold tabular-nums"
                          style={{
                            color: "var(--ink)",
                          }}
                        >
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "var(--muted)" }}>No hay pronóstico diario disponible.</p>
          )}
        </section>
      )}
    </div>
  );
}

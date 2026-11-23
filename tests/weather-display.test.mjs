import test from "node:test";
import assert from "node:assert/strict";
import { condicion, fechaLocal, instanteLocal, valor } from "../src/lib/weather-display.ts";
import { transformarClima } from "../src/lib/open-meteo/transform.ts";
import { DEFAULT_LOCATION, forecastUrl, parseLocation } from "../src/lib/forecast-location.ts";

test("códigos distinguen día, noche, lluvia, nieve, tormenta y desconocidos", () => {
  assert.equal(condicion(0, true).icono, "sun");
  assert.equal(condicion(0, false).icono, "moon");
  assert.equal(condicion(63).descripcion, "Lluvia moderada");
  assert.equal(condicion(75).icono, "snow");
  assert.equal(condicion(95).icono, "storm");
  assert.equal(condicion(999).descripcion, "Condición no disponible");
  assert.equal(condicion(null).descripcion, "Condición no disponible");
});

test("valores faltantes no se convierten en cero", () => {
  assert.equal(valor(null, "°C"), "No disponible");
  assert.equal(valor(0, "°C"), "0°C");
});

test("fechas locales no se desplazan por la zona del servidor", () => {
  assert.match(fechaLocal("2026-01-01T00:15", true), /1 ene 2026, 00:15/);
  assert.match(fechaLocal("2025-12-31", false), /31 dic 2025/);
  assert.equal(fechaLocal("2026-02-30"), "No disponible");
  assert.equal(fechaLocal(null), "No disponible");
});

test("navegación conserva identidad y valida coordenadas", () => {
  const city = {
    id: 123,
    nombre: "San Salvador",
    pais: "El Salvador",
    region: "San Salvador",
    latitud: 13.69,
    longitud: -89.19,
  };
  assert.deepEqual(
    parseLocation(new URL(forecastUrl(city), "http://localhost").searchParams),
    city,
  );
  assert.deepEqual(parseLocation(new URLSearchParams()), DEFAULT_LOCATION);
  assert.equal(parseLocation(new URLSearchParams("latitud=91&longitud=0")), null);
  assert.equal(parseLocation(new URLSearchParams("latitud=1&latitud=2&longitud=0")), null);
  assert.equal(parseLocation(new URLSearchParams("latitud=1")), null);
});

test("instantes respetan transiciones DST y cambios de fecha de cada ciudad", () => {
  const cases = [
    ["2026-03-08T06:30:00.000Z", "America/New_York", /01:30.*GMT-5/],
    ["2026-03-08T07:30:00.000Z", "America/New_York", /03:30.*GMT-4/],
    ["2026-11-01T05:30:00.000Z", "America/New_York", /01:30.*GMT-4/],
    ["2026-11-01T06:30:00.000Z", "America/New_York", /01:30.*GMT-5/],
    ["2026-03-29T00:30:00.000Z", "Europe/Madrid", /01:30.*GMT\+1/],
    ["2026-03-29T01:30:00.000Z", "Europe/Madrid", /03:30.*GMT\+2/],
    ["2026-01-01T05:30:00.000Z", "America/El_Salvador", /31 dic 2025.*23:30.*GMT-6/],
    ["2026-07-01T05:30:00.000Z", "America/El_Salvador", /30 jun 2026.*23:30.*GMT-6/],
  ];
  for (const [instant, zone, expected] of cases)
    assert.match(instanteLocal(instant, zone), expected);
  assert.match(instanteLocal("2026-03-08T07:30:00.000Z", "America/New_York", true), /03:30.*m\./i);
  assert.equal(instanteLocal(null, "America/New_York"), "No disponible");
  assert.equal(instanteLocal("2026-03-08T07:30", "America/New_York"), "No disponible");
  assert.equal(instanteLocal("2026-03-08T07:30:00.000Z", "Invalid/Zone"), "No disponible");
});

test("transformación ordena instantes y conserva fechas diarias del proveedor", () => {
  const earlier = Date.parse("2026-11-01T05:30:00Z") / 1000;
  const later = Date.parse("2026-11-01T06:30:00Z") / 1000;
  const midnight = Date.parse("2026-11-01T04:00:00Z") / 1000;
  const result = transformarClima({
    timezone: "America/New_York",
    utc_offset_seconds: -14400,
    current: {},
    hourly: { time: [later, earlier], temperature_2m: [2, 1] },
    daily: { time: [midnight] },
  });
  assert.equal(result.actual.hora, null);
  assert.deepEqual(
    result.horas.map((hour) => hour.temperatura),
    [1, 2],
  );
  assert.equal(result.dias[0].fecha, "2026-11-01");
  assert.equal(result.dias[0].temperaturaMaxima, null);
});

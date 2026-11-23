import test from "node:test";
import assert from "node:assert/strict";
import { condicion, fechaLocal, valor } from "../src/lib/weather-display.ts";
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

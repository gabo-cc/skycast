import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  consultarClima,
  datosDelDia,
  diferencia,
  fechaEnZona,
  intercambiar,
  seleccionarCiudad,
} from "../src/lib/comparison.ts";
import { forecastUrl, parseLocation } from "../src/lib/forecast-location.ts";

const first = {
  id: 1,
  nombre: "San Salvador",
  pais: "El Salvador",
  region: "San Salvador",
  latitud: 13.69,
  longitud: -89.19,
};
const second = {
  id: 2,
  nombre: "San Salvador",
  pais: "Argentina",
  region: null,
  latitud: -31,
  longitud: -58,
};
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("selecciona ciudades distintas y homónimas, impide duplicados e intercambia", () => {
  const one = seleccionarCiudad([null, null], 0, first);
  assert.equal(seleccionarCiudad(one, 1, first), null);
  const two = seleccionarCiudad(one, 1, second);
  assert.deepEqual(two, [first, second]);
  assert.deepEqual(intercambiar(two), [second, first]);
});
test("diferencias preservan ceros y valores ausentes", () => {
  assert.equal(diferencia(20.4, 22.7), -2.3);
  assert.equal(diferencia(0, 0), 0);
  assert.equal(diferencia(null, 2), null);
  assert.equal(diferencia(2, undefined), null);
});
test("cada ciudad usa su día local y navega con su identidad", () => {
  assert.equal(fechaEnZona("2026-01-01T02:00:00.000Z", "America/El_Salvador"), "2025-12-31");
  assert.equal(fechaEnZona("2026-01-01T02:00:00.000Z", "Europe/Madrid"), "2026-01-01");
  assert.equal(fechaEnZona(null, "Europe/Madrid"), null);
  assert.equal(
    datosDelDia({ actual: { hora: null }, zonaHoraria: "Europe/Madrid", dias: [] }),
    null,
  );
  assert.deepEqual(
    parseLocation(new URL(forecastUrl(second), "http://localhost").searchParams),
    second,
  );
});
test("consultas independientes admiten fallos de una o ambas ciudades", async () => {
  globalThis.fetch = async (url) =>
    url.includes("13.69")
      ? Response.json({ zonaHoraria: "America/El_Salvador", actual: null, dias: [] })
      : new Response(null, { status: 503 });
  const controller = new AbortController();
  const [a, b] = await Promise.allSettled([
    consultarClima(first, controller.signal),
    consultarClima(second, controller.signal),
  ]);
  assert.equal(a.status, "fulfilled");
  assert.equal(b.status, "rejected");
  globalThis.fetch = async () => new Response(null, { status: 503 });
  const failed = await Promise.allSettled([
    consultarClima(first, controller.signal),
    consultarClima(second, controller.signal),
  ]);
  assert.deepEqual(
    failed.map((result) => result.status),
    ["rejected", "rejected"],
  );
});
test("la cancelación se transmite a la consulta", async () => {
  globalThis.fetch = async (_url, { signal }) =>
    new Promise((_resolve, reject) =>
      signal.addEventListener("abort", () => reject(signal.reason)),
    );
  const controller = new AbortController();
  const pending = consultarClima(first, controller.signal);
  controller.abort();
  await assert.rejects(pending);
});
test("rechaza respuestas meteorológicas incompletas o malformadas", async () => {
  const controller = new AbortController();
  for (const body of [
    {},
    { zonaHoraria: "America/New_York", actual: {}, dias: [] },
    { zonaHoraria: "Europe/Madrid", actual: null, dias: [null] },
  ]) {
    globalThis.fetch = async () => Response.json(body);
    await assert.rejects(consultarClima(first, controller.signal));
  }
});

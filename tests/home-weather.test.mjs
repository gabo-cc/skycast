import test from "node:test";
import assert from "node:assert/strict";
import { horasDeInicio, lecturaDeInicio } from "../src/lib/home-weather.ts";

const current = { hora: "2026-11-25T12:30:00.000Z", temperatura: 25 };
const hours = Array.from({ length: 27 }, (_, index) => ({
  hora: new Date(Date.UTC(2026, 10, 25, 11 + index)).toISOString(),
  temperatura: index,
  codigoMeteorologico: index === 2 ? 63 : 0,
  esDeDia: index !== 2,
}));
const weather = { actual: current, horas: hours };

test("Inicio limita el pronóstico a las próximas 24 horas desde la hora actual", () => {
  const result = horasDeInicio(weather);
  assert.equal(result.length, 24);
  assert.equal(result[0].hora, "2026-11-25T12:00:00.000Z");
});

test("la selección devuelve datos de la hora elegida y Ahora restaura los actuales", () => {
  const selected = lecturaDeInicio(weather, hours[2].hora);
  assert.equal(selected.reading, hours[2]);
  assert.equal(selected.reading.codigoMeteorologico, 63);
  assert.equal(selected.reading.esDeDia, false);
  assert.equal(lecturaDeInicio(weather, null).reading, current);
  assert.equal(lecturaDeInicio(weather, hours[0].hora).reading, current);
});

test("con datos actuales ausentes se conservan las horas disponibles", () => {
  const withoutCurrent = { actual: null, horas: hours.slice(0, 2) };
  assert.equal(horasDeInicio(withoutCurrent).length, 2);
  assert.equal(lecturaDeInicio(withoutCurrent, null).reading, null);
  assert.equal(lecturaDeInicio(withoutCurrent, hours[1].hora).reading, hours[1]);
});

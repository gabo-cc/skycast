import test from "node:test";
import assert from "node:assert/strict";
import { graficaTemperaturas } from "../src/lib/forecast-chart.ts";
import { repeatedLocalHours, weatherHourLabel } from "../src/lib/weather-time.ts";

test("la gráfica conserva ceros y separa los tramos cuando faltan temperaturas", () => {
  const chart = graficaTemperaturas([0, 10, null, -5, 5].map((temperatura) => ({ temperatura })));
  assert.equal(chart.min, -5);
  assert.equal(chart.max, 10);
  assert.equal(chart.points[2], null);
  assert.deepEqual(
    chart.segments.map((segment) => segment.length),
    [2, 2],
  );
  assert.equal(chart.points[0].x, 5);
  assert.equal(chart.points[4].x, 95);
});

test("la gráfica maneja series vacías, temperaturas iguales y un único punto", () => {
  assert.equal(graficaTemperaturas([]), null);
  assert.equal(graficaTemperaturas([{ temperatura: null }]), null);
  assert.deepEqual(graficaTemperaturas([{ temperatura: 0 }]).points[0], { x: 50, y: 35 });
  assert.deepEqual(
    graficaTemperaturas([{ temperatura: 8 }, { temperatura: 8 }]).points.map((point) => point.y),
    [35, 35],
  );
});

test("las horas repetidas conservan el desplazamiento local en la gráfica", () => {
  const hours = [{ hora: "2026-11-01T05:00:00.000Z" }, { hora: "2026-11-01T06:00:00.000Z" }];
  const zone = "America/New_York";
  const first = weatherHourLabel(hours[0].hora, zone);
  const second = weatherHourLabel(hours[1].hora, zone);
  assert.equal(first.time, second.time);
  assert.notEqual(first.offset, second.offset);
  assert.ok(repeatedLocalHours(hours, zone).has(`${first.date}|${first.time}`));
});

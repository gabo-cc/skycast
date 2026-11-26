import test from "node:test";
import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { paisajeMeteorologico } from "../src/lib/weather-landscapes.ts";

const city = { id: 1, latitud: 13.69, longitud: -89.19 };

test("la selección es estable por ciudad y condición, y varía entre ciudades", () => {
  const first = paisajeMeteorologico(city, 0, true);
  assert.equal(paisajeMeteorologico({ ...city }, 0, true), first);
  const alternatives = new Set(
    Array.from({ length: 100 }, (_, index) =>
      paisajeMeteorologico({ id: index + 1, latitud: index / 10, longitud: index / 20 }, 0, true),
    ),
  );
  assert.equal(alternatives.size, 2);
  assert.equal(paisajeMeteorologico(city, null, true), null);
  assert.equal(paisajeMeteorologico(city, 0, null), null);
});

test("cada condición usa archivos locales existentes y respeta día, noche y nieve", async () => {
  const cases = [
    [0, true, ["sunny"]],
    [2, true, ["partly-cloudy"]],
    [3, true, ["cloudy"]],
    [51, true, ["drizzle"]],
    [63, true, ["rain"]],
    [95, true, ["storm", "rain"]],
    [0, false, ["clear-night"]],
    [3, false, ["cloudy-night"]],
    [51, false, ["rain-night", "storm-night"]],
    [63, false, ["rain-night", "storm-night"]],
    [95, false, ["rain-night", "storm-night"]],
    [71, true, ["snow-day"]],
    [75, false, ["snow-night"]],
  ];
  for (const [code, day, names] of cases) {
    const selected = new Set();
    for (let id = 1; id <= 50; id += 1) {
      const result = paisajeMeteorologico({ id, latitud: id / 10, longitud: -id / 20 }, code, day);
      assert.ok(
        names.some((name) => result.includes(name)),
        result,
      );
      selected.add(result);
      await access(new URL(`../public${result}`, import.meta.url));
    }
    assert.equal(selected.size, 2, `${code}/${day}`);
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { capasAmbiente, clasificarAmbiente } from "../src/lib/weather-atmosphere.ts";
import { rellenoFavorito } from "../src/lib/favorite-presentation.ts";

test("clasifica ambientes con códigos WMO y datos diurnos", () => {
  for (const [code, day, expected] of [
    [0, true, "sunny"],
    [2, true, "partly-cloudy"],
    [3, true, "cloudy"],
    [51, true, "drizzle"],
    [63, true, "rain"],
    [95, false, "storm"],
    [0, false, "clear-night"],
    [3, false, "cloudy-night"],
    [999, true, "neutral"],
    [null, true, "neutral"],
    [0, null, "neutral"],
  ])
    assert.equal(clasificarAmbiente(code, day), expected);
});

test("las capas respetan condiciones reales y distinguen intensidades de precipitación", () => {
  const layers = (code, day) => capasAmbiente(clasificarAmbiente(code, day));
  assert.deepEqual(layers(0, false), {
    nubes: false,
    estrellas: true,
    luna: true,
    sol: false,
    lluvia: null,
  });
  assert.equal(layers(0, true).sol, true);
  assert.equal(layers(2, true).nubes, true);
  assert.equal(layers(3, false).estrellas, false);
  assert.equal(layers(51, true).lluvia, "drizzle");
  assert.equal(layers(63, false).lluvia, "rain");
  assert.equal(layers(95, true).lluvia, "storm");
  assert.equal(layers(75, true).lluvia, null);
  assert.deepEqual(layers(null, null), {
    nubes: false,
    estrellas: false,
    luna: false,
    sol: false,
    lluvia: null,
  });
});

test("favoritos y movimiento reducido utilizan los estados y tokens previstos", async () => {
  assert.equal(rellenoFavorito(true), "currentColor");
  assert.equal(rellenoFavorito(false), "none");
  const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(css, /--favorite:\s*#087f95/i);
  assert.match(css, /--favorite:\s*#7dd3e8/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.atmosphere-cloud[\s\S]*?animation:\s*none\s*!important/);
});

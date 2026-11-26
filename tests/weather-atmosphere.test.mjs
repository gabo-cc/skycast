import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { clasificarAmbiente } from "../src/lib/weather-atmosphere.ts";
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

test("favoritos y movimiento reducido utilizan los estados y tokens previstos", async () => {
  assert.equal(rellenoFavorito(true), "currentColor");
  assert.equal(rellenoFavorito(false), "none");
  const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(css, /--favorite:\s*#087f95/i);
  assert.match(css, /--favorite:\s*#7dd3e8/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.atmosphere-cloud[\s\S]*?animation:\s*none\s*!important/);
});

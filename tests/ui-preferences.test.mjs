import test from "node:test";
import assert from "node:assert/strict";
import {
  effectiveTheme,
  readTheme,
  saveTheme,
  THEME_KEY,
  themePreference,
} from "../src/lib/theme.ts";
import { diaSeleccionado } from "../src/lib/forecast-view.ts";
import { estiloClima } from "../src/lib/weather-display.ts";

test("tema claro, oscuro y automático respetan el sistema y se recuperan", () => {
  let value = null;
  const storage = {
    getItem: (key) => {
      assert.equal(key, THEME_KEY);
      return value;
    },
    setItem: (key, next) => {
      assert.equal(key, THEME_KEY);
      value = next;
    },
  };
  assert.equal(readTheme(storage), "auto");
  assert.equal(effectiveTheme("auto", false), "light");
  assert.equal(effectiveTheme("auto", true), "dark");
  saveTheme(storage, "dark");
  assert.equal(readTheme(storage), "dark");
  assert.equal(effectiveTheme(readTheme(storage), false), "dark");
  saveTheme(storage, "light");
  assert.equal(effectiveTheme(readTheme(storage), true), "light");
  assert.equal(themePreference("desconocido"), "auto");
});
test("día seleccionado y presentación climática manejan datos ausentes", () => {
  const day = {
    fecha: "2026-01-01",
    temperaturaMaxima: null,
    temperaturaMinima: 0,
    probabilidadPrecipitacionMaxima: null,
    codigoMeteorologico: 3,
  };
  assert.equal(diaSeleccionado([day], 0), day);
  assert.equal(diaSeleccionado([day], 1), null);
  assert.equal(estiloClima(0, true), "weather-sunny");
  assert.equal(estiloClima(0, false), "weather-night");
  assert.equal(estiloClima(3, true), "weather-cloudy");
  assert.equal(estiloClima(63, true), "weather-rainy");
  assert.equal(estiloClima(95, true), "weather-storm");
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import * as homeWeather from "../src/lib/home-weather.ts";
import * as weatherDisplay from "../src/lib/weather-display.ts";
import * as forecastView from "../src/lib/forecast-view.ts";
import * as forecastChart from "../src/lib/forecast-chart.ts";
import * as weatherTime from "../src/lib/weather-time.ts";

function loadComponent(file) {
  const require = createRequire(import.meta.url);
  const source = readFileSync(new URL(`../src/components/${file}.tsx`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const modules = {
    "next/link": {
      __esModule: true,
      default: ({ children, ...props }) => React.createElement("a", props, children),
    },
    "@/components/icon": { Icon: () => null },
    "@/components/weather-atmosphere": { WeatherAtmosphere: () => null },
    "@/components/forecast-sky-scene": { ForecastSkyScene: () => null },
    "@/lib/forecast-location": { forecastUrl: () => "/pronostico" },
    "@/lib/home-weather": homeWeather,
    "@/lib/weather-display": weatherDisplay,
    "@/lib/forecast-view": forecastView,
    "@/lib/forecast-chart": forecastChart,
    "@/lib/weather-time": weatherTime,
  };
  const compiledModule = { exports: {} };
  new Function("require", "module", "exports", compiled)(
    (name) => modules[name] ?? require(name),
    compiledModule,
    compiledModule.exports,
  );
  return compiledModule.exports;
}

const hour = {
  hora: "2026-11-25T12:00:00.000Z",
  temperatura: 26,
  probabilidadPrecipitacion: 20,
  codigoMeteorologico: 63,
  esDeDia: true,
};
const weather = {
  zonaHoraria: "America/El_Salvador",
  actual: { ...hour, sensacionTermica: 27, humedad: 70, viento: 8 },
  horas: [hour],
  dias: [],
};

test("el nombre accesible de cada hora incluye su texto visible en orden", () => {
  const { HomeSkyExperience } = loadComponent("home-sky-experience");
  const markup = renderToStaticMarkup(
    React.createElement(HomeSkyExperience, {
      city: { nombre: "San Salvador", pais: "El Salvador" },
      weather,
    }),
  );
  const match = markup.match(/<button\b([^>]*\btitle="[^"]+"[^>]*)>([\s\S]*?)<\/button>/);
  assert.ok(match, "debe existir un botón para la hora");
  const accessibleName = match[1].match(/aria-label="([^"]+)"/)?.[1];
  const visibleText = match[2]
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  assert.equal(visibleText, "06:00 26°C 20%");
  assert.ok(accessibleName?.includes(visibleText));
  assert.match(accessibleName, /Lluvia moderada/);
  assert.match(accessibleName, /probabilidad de precipitación 20%/);
});

function contrast(first, second) {
  function luminance(hex) {
    const channels = hex.match(/[a-f\d]{2}/gi).map((channel) => {
      const value = parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels.reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  }
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("la hora seleccionada del pronóstico conserva contraste AA en ambos temas", () => {
  const { ForecastInteractive } = loadComponent("forecast-interactive");
  const markup = renderToStaticMarkup(React.createElement(ForecastInteractive, { weather }));
  const selected = markup.match(
    /<button\b[^>]*aria-pressed="true"[^>]*class="[^"]*min-h-19[^>]*style="([^"]+)"/,
  );
  assert.ok(selected, "debe existir una hora seleccionada");
  const properties = Object.fromEntries(selected[1].split(";").map((item) => item.split(":")));
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  for (const selector of [":root", '[data-theme="dark"]']) {
    const block = css.slice(css.indexOf(`${selector} {`)).split("}")[0];
    const resolve = (value) => {
      const variable = value.match(/^var\((--[\w-]+)\)$/)?.[1];
      return variable ? block.match(new RegExp(`${variable}:\\s*(#[a-f\\d]{6})`, "i"))?.[1] : value;
    };
    const foreground = resolve(properties.color);
    const background = resolve(properties.background);
    assert.ok(foreground && background, `colores no disponibles para ${selector}`);
    assert.ok(contrast(foreground, background) >= 4.5, `contraste insuficiente en ${selector}`);
  }
});

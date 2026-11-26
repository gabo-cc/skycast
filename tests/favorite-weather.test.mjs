import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { crearColaClima } from "../src/lib/favorite-weather.ts";
import { forecastUrl, parseLocation } from "../src/lib/forecast-location.ts";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

const cities = [
  {
    id: 1,
    nombre: "San Salvador",
    pais: "El Salvador",
    region: null,
    latitud: 13.69,
    longitud: -89.19,
  },
  {
    id: 2,
    nombre: "San Salvador",
    pais: "Argentina",
    region: "Entre Ríos",
    latitud: -31,
    longitud: -58,
  },
];

test("cada tarjeta enlaza al pronóstico de su ciudad y el corazón queda fuera del enlace", () => {
  const require = createRequire(import.meta.url);
  const source = readFileSync(
    new URL("../src/components/favorite-cities.tsx", import.meta.url),
    "utf8",
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const mocks = {
    "next/link": {
      __esModule: true,
      default: ({ href, children, ...props }) =>
        React.createElement(
          "a",
          { href, "aria-label": props["aria-label"], className: props.className },
          children,
        ),
    },
    "@/components/icon": { Icon: () => null },
    "@/components/city-photo": {
      CityPhotoBackground: () => null,
      CityPhotoCredit: () => null,
    },
    "@/components/scene-photos": {
      useScenePhoto: () => ({ photo: null, loaded: false }),
      ScenePhotoProvider: ({ children }) => children,
    },
    "@/components/weather-atmosphere": { WeatherAtmosphere: () => null },
    "@/components/weather-attribution": { WeatherAttribution: () => null },
    "@/components/favorite-heart": {
      FavoriteHeart: ({ onClick }) => React.createElement("button", { onClick }, "Quitar"),
    },
    "@/hooks/use-favorites": {},
    "@/lib/favorite-weather": {},
    "@/lib/forecast-location": { forecastUrl },
    "@/lib/weather-display": {
      condicion: () => ({ descripcion: "", icono: "cloud" }),
      valor: () => "",
    },
  };
  const compiledModule = { exports: {} };
  const load = (name) => mocks[name] ?? require(name);
  new Function("require", "module", "exports", compiled)(
    load,
    compiledModule,
    compiledModule.exports,
  );
  for (const city of cities) {
    const html = renderToStaticMarkup(
      React.createElement(compiledModule.exports.FavoriteCityCard, { city, onRemove() {} }),
    );
    const link = html.match(/<a\b[^>]*href="([^"]+)"[^>]*><\/a>/);
    assert.ok(link, html);
    assert.deepEqual(
      parseLocation(new URL(link[1].replaceAll("&amp;", "&"), "http://localhost").searchParams),
      city,
    );
    assert.match(html, /<button\b/);
    assert.ok(html.indexOf("</a>") < html.indexOf("<button"));
  }
});

test("la cola limita la concurrencia, cancela pendientes y reutiliza resultados", async () => {
  const pending = [];
  let calls = 0;
  globalThis.fetch = (_url, { signal }) => {
    calls += 1;
    return new Promise((resolve, reject) => {
      pending.push(() => resolve(Response.json({ zonaHoraria: "UTC", actual: null, dias: [] })));
      signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    });
  };
  const request = crearColaClima(2);
  const controllers = Array.from({ length: 4 }, () => new AbortController());
  const locations = Array.from({ length: 4 }, (_, index) => ({ latitud: index, longitud: index }));
  const results = locations.map((city, index) => request(city, controllers[index].signal));
  const cancelled = assert.rejects(results[2]);
  assert.equal(calls, 2);
  controllers[2].abort();
  await cancelled;
  pending[0]();
  await results[0];
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls, 3);
  pending[1]();
  pending[2]();
  await Promise.all([results[1], results[3]]);
  await request(locations[0], new AbortController().signal);
  assert.equal(calls, 3);
});

test("un fallo individual permite volver a consultar sin afectar otras ciudades", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return calls === 1
      ? new Response(null, { status: 503 })
      : Response.json({ zonaHoraria: "UTC", actual: null, dias: [] });
  };
  const request = crearColaClima(1);
  await assert.rejects(request(cities[0], new AbortController().signal));
  const result = await request(cities[0], new AbortController().signal);
  assert.equal(result.zonaHoraria, "UTC");
  assert.equal(calls, 2);
});

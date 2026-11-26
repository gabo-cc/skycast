import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

test("la atribución meteorológica enlaza al proveedor y a la licencia e indica adaptación", () => {
  const source = readFileSync(
    new URL("../src/components/weather-attribution.tsx", import.meta.url),
    "utf8",
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const compiledModule = { exports: {} };
  new Function("require", "module", "exports", compiled)(
    createRequire(import.meta.url),
    compiledModule,
    compiledModule.exports,
  );
  const html = renderToStaticMarkup(React.createElement(compiledModule.exports.WeatherAttribution));
  assert.match(html, /href="https:\/\/open-meteo\.com\/"[^>]*>Open-Meteo<\/a>/);
  assert.match(html, /href="https:\/\/creativecommons\.org\/licenses\/by\/4\.0\/"[^>]*>/);
  assert.match(html, /datos adaptados/);
});

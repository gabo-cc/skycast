import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const city = {
  id: 1,
  nombre: "San Salvador",
  pais: "El Salvador",
  region: null,
  latitud: 13.69,
  longitud: -89.19,
};
const photo = {
  url: "https://images.unsplash.com/example?w=1080",
  fotografo: "Fotógrafa",
  perfil: "https://unsplash.com/@ejemplo?utm_source=skycast&utm_medium=referral",
};

function loadPresentation(react) {
  const require = createRequire(import.meta.url);
  const source = readFileSync(new URL("../src/components/city-photo.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const exports = {};
  const compiledModule = { exports };
  const load = (name) => {
    if (name === "react") return react;
    if (name === "next/image") return { __esModule: true, default: "img" };
    return require(name);
  };
  new Function("require", "module", "exports", "setTimeout", compiled)(
    load,
    compiledModule,
    exports,
    () => 0,
  );
  return compiledModule.exports;
}

test("la foto solo queda activa al cargar y un error restaura el respaldo sin otra consulta", async () => {
  const originalFetch = globalThis.fetch;
  let count = 0;
  globalThis.fetch = async () => {
    count += 1;
    return Response.json({ foto: photo });
  };
  let state = null;
  let lastDependency;
  let cleanup;
  const hooks = {
    useState: () => [
      state,
      (update) => {
        state = typeof update === "function" ? update(state) : update;
      },
    ],
    useEffect: (effect, dependencies) => {
      if (dependencies[0] === lastDependency) return;
      cleanup?.();
      lastDependency = dependencies[0];
      cleanup = effect();
    },
  };
  try {
    const { useCityPhoto } = loadPresentation(hooks);
    assert.equal(useCityPhoto(city).photo, null);
    await new Promise((resolve) => setImmediate(resolve));
    let view = useCityPhoto(city);
    assert.deepEqual(view.photo, photo);
    assert.equal(view.loaded, false);
    view.onLoad();
    view = useCityPhoto(city);
    assert.equal(view.loaded, true);
    view.onError();
    view = useCityPhoto(city);
    assert.equal(view.photo, null);
    assert.equal(view.loaded, false);
    assert.equal(count, 1);
    cleanup?.();
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("la portada transmite los eventos y los créditos enlazan al fotógrafo y a Unsplash", () => {
  const { CityPhotoBackground, CityPhotoCredit } = loadPresentation(React);
  const onLoad = () => {};
  const onError = () => {};
  const image = CityPhotoBackground({ photo, loaded: true, onLoad, onError });
  assert.equal(image.props.onLoad, onLoad);
  assert.equal(image.props.onError, onError);
  assert.match(image.props.className, /is-loaded/);
  assert.equal(image.props.alt, "");
  const credit = renderToStaticMarkup(React.createElement(CityPhotoCredit, { photo }));
  assert.match(credit, /Fotografía de archivo/);
  assert.match(credit, /Foto:/);
  assert.match(credit, /Fotógrafa/);
  assert.match(credit, /utm_source=skycast&amp;utm_medium=referral/);
  assert.match(credit, /https:\/\/unsplash\.com\/@ejemplo/);
  assert.match(credit, /https:\/\/unsplash\.com\/\?/);
  assert.equal(renderToStaticMarkup(React.createElement(CityPhotoCredit, { photo: null })), "");
});

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import { esBusquedaValida } from "../src/lib/city-search.ts";
import { DEFAULT_LOCATION } from "../src/lib/forecast-location.ts";

function createRenderer(filename, exportName, props) {
  const slots = [];
  const searches = [];
  let cursor = 0;
  let effects = [];
  let tree;

  const hooks = {
    useState(initial) {
      const index = cursor++;
      slots[index] ??= { value: initial };
      return [
        slots[index].value,
        (value) => {
          slots[index].value = typeof value === "function" ? value(slots[index].value) : value;
        },
      ];
    },
    useRef(initial) {
      const index = cursor++;
      slots[index] ??= { current: initial };
      return slots[index];
    },
    useId: () => "search-id",
    useCallback(callback, dependencies) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || dependencies.some((value, i) => !Object.is(value, previous.deps[i]))) {
        slots[index] = { callback, deps: dependencies };
      }
      return slots[index].callback;
    },
    useEffect(effect, dependencies) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || dependencies.some((value, i) => !Object.is(value, previous.deps[i]))) {
        effects.push(() => {
          previous?.cleanup?.();
          slots[index] = { deps: dependencies, cleanup: effect() };
        });
      }
    },
  };

  const mocks = {
    react: hooks,
    "next/link": { __esModule: true, default: () => null },
    "@/components/icon": { Icon: () => null },
    "@/components/home-sky-experience": { HomeSkyExperience: () => null },
    "@/components/weather-attribution": { WeatherAttribution: () => null },
    "@/lib/forecast-location": { DEFAULT_LOCATION, forecastUrl: () => "/pronostico" },
    "@/lib/city-search": {
      esBusquedaValida,
      iniciarBusqueda(query, onResult) {
        const search = { query, onResult, cancelled: false };
        searches.push(search);
        return () => {
          search.cancelled = true;
        };
      },
    },
  };
  const source = readFileSync(new URL(`../src/components/${filename}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const require = createRequire(import.meta.url);
  const compiledModule = { exports: {} };
  new Function("require", "module", "exports", compiled)(
    (name) => mocks[name] ?? require(name),
    compiledModule,
    compiledModule.exports,
  );

  function render() {
    cursor = 0;
    effects = [];
    tree = compiledModule.exports[exportName](props);
    effects.forEach((effect) => effect());
    return tree;
  }

  function findNode(predicate, node) {
    if (!node || typeof node !== "object") return null;
    if (Array.isArray(node)) {
      for (const child of node) {
        const match = findNode(predicate, child);
        if (match) return match;
      }
      return null;
    }
    return predicate(node) ? node : findNode(predicate, node.props?.children);
  }

  function nodeText(node) {
    if (Array.isArray(node)) return node.map(nodeText).join("");
    if (typeof node === "string" || typeof node === "number") return String(node);
    return node && typeof node === "object" ? nodeText(node.props?.children) : "";
  }

  return {
    render,
    find: (predicate) => findNode(predicate, tree),
    textContent: () => nodeText(tree),
    searches,
  };
}

for (const [description, filename, name, props] of [
  ["Inicio", "home-dashboard.tsx", "HomeDashboard", { initialWeather: {} }],
  [
    "Comparar",
    "comparison-selector.tsx",
    "ComparisonSelector",
    { label: "Primera ciudad", city: null, favorites: [], onSelect() {} },
  ],
]) {
  test(`${description}: espacios exteriores conservan resultados y solicitudes pendientes`, () => {
    const originalWindow = globalThis.window;
    const originalStorage = globalThis.localStorage;
    globalThis.window = {
      location: { origin: "http://localhost" },
      addEventListener() {},
      removeEventListener() {},
    };
    globalThis.localStorage = { getItem: () => null };

    try {
      const view = createRenderer(filename, name, props);
      view.render();
      if (name === "HomeDashboard") {
        view.find((node) => node.props?.["aria-controls"] === "home-city-picker").props.onClick();
        view.render();
      }
      const change = (value) => {
        view
          .find((node) => node.type === "input" && node.props.type === "search")
          .props.onChange({
            target: { value },
          });
        view.render();
      };

      change("Madrid");
      assert.equal(view.searches.length, 1);
      change(" Madrid ");
      assert.equal(view.searches.length, 1);
      assert.equal(view.searches[0].cancelled, false);
      view.searches[0].onResult({ status: "success", ciudades: [DEFAULT_LOCATION] });
      view.render();
      assert.match(view.textContent(), /1 resultados encontrados/);
      change("Madrid");
      assert.match(view.textContent(), /1 resultados encontrados/);

      change("Madrid Centro");
      assert.equal(view.searches.length, 2);
      assert.equal(view.searches[0].cancelled, true);
      view.searches[0].onResult({ status: "success", ciudades: [] });
      view.render();
      assert.match(view.textContent(), /Buscando ciudades/);
      view.searches[1].onResult({ status: "success", ciudades: [DEFAULT_LOCATION] });
      view.render();
      assert.match(view.textContent(), /1 resultados encontrados/);
    } finally {
      globalThis.window = originalWindow;
      globalThis.localStorage = originalStorage;
    }
  });
}

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import * as theme from "../src/lib/theme.ts";

function loadComponent(path, mocks = {}) {
  const source = readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const require = createRequire(import.meta.url);
  const component = { exports: {} };
  new Function("require", "module", "exports", compiled)(
    (name) => mocks[name] ?? require(name),
    component,
    component.exports,
  );
  return component.exports;
}

const link = {
  __esModule: true,
  default: ({ children, ...props }) => React.createElement("a", props, children),
};

test("la página 404 presenta enlaces navegables y un encabezado descriptivo", () => {
  const { default: NotFound } = loadComponent("app/not-found.tsx", {
    "next/link": link,
    "@/components/icon": { Icon: () => null },
  });
  const markup = renderToStaticMarkup(React.createElement(NotFound));
  assert.match(markup, /<h1[^>]*>¡Ups! Parece que te perdiste entre las nubes<\/h1>/);
  assert.match(markup, /<a href="\/"[^>]*>Volver al inicio<\/a>/);
  assert.match(markup, /<a href="\/buscar"[^>]*>Buscar una ciudad<\/a>/);
});

test("los límites de error conectan el reintento y no muestran detalles técnicos", () => {
  const { WeatherError } = loadComponent("components/weather-error.tsx", { "next/link": link });
  for (const path of ["app/error.tsx", "app/pronostico/error.tsx"]) {
    const { default: ErrorPage } = loadComponent(path, {
      "@/components/weather-error": { WeatherError },
    });
    let retries = 0;
    const element = ErrorPage({
      error: new Error("detalle privado"),
      retry: () => retries++,
    });
    const fallback = element.type(element.props);
    const button = React.Children.toArray(fallback.props.children).find(
      (child) => child.type === "button",
    );
    assert.ok(button);
    button.props.onClick();
    assert.equal(retries, 1);
    const markup = renderToStaticMarkup(element);
    assert.doesNotMatch(markup, /detalle privado/);
    assert.match(markup, /role="alert"/);
    assert.match(markup, /<a href="\/"[^>]*>Volver al inicio<\/a>/);
  }
});

function findElement(node, predicate) {
  if (!node || typeof node !== "object") return undefined;
  if (Array.isArray(node)) {
    return node.map((child) => findElement(child, predicate)).find(Boolean);
  }
  return predicate(node) ? node : findElement(node.props?.children, predicate);
}

test("el selector actualiza los tres modos y conserva la preferencia al recargar", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalStorage = globalThis.localStorage;
  const values = new Map();
  const media = {
    matches: false,
    addEventListener: (_event, callback) => (media.onChange = callback),
    removeEventListener() {},
  };
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const document = { documentElement: { dataset: {} } };
  const window = {
    matchMedia: () => media,
    addEventListener() {},
    removeEventListener() {},
  };
  const state = [];
  let cursor = 0;
  let effect;
  const hooks = {
    useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = initial;
      return [state[index], (value) => (state[index] = value)];
    },
    useEffect(callback) {
      effect ??= callback;
    },
  };
  const layout = readFileSync(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  const bootstrap = layout.match(/__html: `([^`]+)`/)?.[1];
  assert.ok(bootstrap);

  try {
    globalThis.window = window;
    globalThis.document = document;
    globalThis.localStorage = storage;
    const { ThemeSelector } = loadComponent("components/theme-selector.tsx", {
      react: hooks,
      "@/lib/theme": theme,
    });
    function render() {
      cursor = 0;
      return ThemeSelector();
    }
    function choose(value) {
      const select = findElement(render(), (node) => node.type === "select");
      select.props.onChange({ target: { value } });
    }
    function reload() {
      const freshDocument = { documentElement: { dataset: {} } };
      runInNewContext(bootstrap, {
        document: freshDocument,
        localStorage: storage,
        matchMedia: window.matchMedia,
      });
      return freshDocument.documentElement.dataset.theme;
    }

    render();
    effect();
    assert.equal(document.documentElement.dataset.theme, "light");
    choose("dark");
    assert.equal(document.documentElement.dataset.theme, "dark");
    assert.equal(reload(), "dark");
    choose("light");
    assert.equal(document.documentElement.dataset.theme, "light");
    assert.equal(reload(), "light");
    choose("auto");
    assert.equal(storage.getItem(theme.THEME_KEY), "auto");
    assert.equal(reload(), "light");
    media.matches = true;
    media.onChange();
    assert.equal(document.documentElement.dataset.theme, "dark");
    assert.equal(reload(), "dark");
    choose("light");
    media.onChange();
    assert.equal(document.documentElement.dataset.theme, "light");
  } finally {
    globalThis.window = originalWindow;
    globalThis.document = originalDocument;
    globalThis.localStorage = originalStorage;
  }
});

test("los textos y controles de error tienen contraste suficiente con ambos temas", () => {
  const { default: NotFound } = loadComponent("app/not-found.tsx", {
    "next/link": link,
    "@/components/icon": { Icon: () => null },
  });
  const { WeatherError } = loadComponent("components/weather-error.tsx", { "next/link": link });
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  function luminance(hex) {
    const channels = hex.match(/[a-f\d]{2}/gi).map((channel) => {
      const value = parseInt(channel, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels.reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
  }
  let checkedColors = 0;
  function check(node, variables, background = variables["--page"]) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach((child) => check(child, variables, background));
      return;
    }
    const resolve = (value) => variables[value?.match(/^var\((--[\w-]+)\)$/)?.[1]];
    const style = node.props?.style ?? {};
    const nextBackground = resolve(style.backgroundColor ?? style.background) ?? background;
    const foreground = resolve(style.color);
    if (foreground) {
      checkedColors++;
      const values = [luminance(foreground), luminance(nextBackground)].sort((a, b) => b - a);
      assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5, `contraste de ${style.color}`);
    }
    check(node.props?.children, variables, nextBackground);
  }
  for (const selector of [":root", '[data-theme="dark"]']) {
    checkedColors = 0;
    const block = css.slice(css.indexOf(`${selector} {`)).split("}")[0];
    const variables = Object.fromEntries(
      [...block.matchAll(/(--[\w-]+):\s*(#[a-f\d]{6})/gi)].map((match) => [match[1], match[2]]),
    );
    check(NotFound(), variables);
    check(WeatherError({ retry() {} }), variables);
    assert.equal(checkedColors, 10, `colores comprobados en ${selector}`);
  }
});

import test from "node:test";
import assert from "node:assert/strict";
import {
  asignarPaisajes,
  categoriaPaisaje,
  opcionesPaisaje,
} from "../src/lib/weather-landscapes.ts";

const photo = (id, query = "") => ({
  url: `https://images.unsplash.com/${id}${query}`,
  fotografo: "Photographer",
  perfil: "https://unsplash.com/@photographer?utm_source=skycast&utm_medium=referral",
});
const entry = (id, ambientales = [], locales = [], verificada = null) => ({
  id,
  verificada,
  ambientales,
  locales,
});

test("las categorías y variantes corresponden a la condición y al día o la noche", () => {
  assert.equal(categoriaPaisaje(0, true), "sunny");
  assert.equal(categoriaPaisaje(0, false), "clearNight");
  assert.equal(categoriaPaisaje(63, false), "rainNight");
  assert.equal(categoriaPaisaje(71, true), "snowDay");
  assert.equal(categoriaPaisaje(71, false), "snowNight");
  assert.equal(categoriaPaisaje(null, true), null);
  assert.strictEqual(opcionesPaisaje(null, true), opcionesPaisaje(null, true));
  assert.ok(opcionesPaisaje(0, true).every((path) => path.includes("sunny")));
});

test("las fotos verificadas tienen prioridad y no se reutilizan en paisajes genéricos", () => {
  const result = asignarPaisajes([
    entry(1, [], [], photo("city")),
    entry(2, [photo("city", "?w=900"), photo("forest")]),
  ]);
  assert.equal(result[1].foto.url, photo("city").url);
  assert.equal(result[1].ilustrativo, false);
  assert.equal(result[2].foto.url, photo("forest").url);
  assert.equal(result[2].ilustrativo, true);
});

test("se asignan imágenes ambientales únicas de forma estable sin depender del orden", () => {
  const options = [photo("mountain"), photo("forest"), photo("sky")];
  const entries = [entry(1, options), entry(2, options), entry(3, options)];
  const first = asignarPaisajes(entries);
  const reverse = asignarPaisajes([...entries].reverse());
  assert.deepEqual(first, reverse);
  assert.deepEqual(first, asignarPaisajes(entries));
  assert.equal(new Set(Object.values(first).map((item) => item.foto.url)).size, 3);
});

test("se consideran alternativas cruzadas y un local cuando evita una foto repetida", () => {
  const result = asignarPaisajes([
    entry(1, [photo("shared")], ["/weather/forest.webp"]),
    entry(2, [photo("shared")]),
    entry(3, [photo("different")], ["/weather/other.webp"]),
  ]);
  assert.equal(result[1].paisaje, "/weather/forest.webp");
  assert.equal(result[2].foto.url, photo("shared").url);
  assert.equal(result[3].foto.url, photo("different").url);
});

test("los respaldos locales también se emparejan entre categorías con opciones compartidas", () => {
  const result = asignarPaisajes([
    entry(1, [], ["/weather/a.webp", "/weather/b.webp"]),
    entry(2, [], ["/weather/a.webp"]),
    entry(3, [], ["/weather/b.webp", "/weather/c.webp"]),
  ]);
  assert.equal(new Set(Object.values(result).map((item) => item.paisaje)).size, 3);
  assert.ok(Object.values(result).every((item) => item.ilustrativo && item.foto === null));
});

test("se permite repetir cuando no hay alternativas suficientes", () => {
  const result = asignarPaisajes([entry(1, [photo("only")]), entry(2, [photo("only")]), entry(3)]);
  assert.equal(result[1].foto.url, result[2].foto.url);
  assert.deepEqual(result[3], { foto: null, paisaje: null, ilustrativo: true });
});

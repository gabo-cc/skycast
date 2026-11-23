import test from "node:test";
import assert from "node:assert/strict";
import {
  actualizarFavoritos,
  esEventoFavoritos,
  FAVORITES_KEY,
  FavoritesError,
  leerFavoritos,
} from "../src/lib/favorites-storage.ts";

function memoryStorage(initial = null) {
  let value = initial;
  let writes = 0;
  return {
    getItem: () => value,
    setItem: (_key, next) => {
      value = next;
      writes++;
    },
    get value() {
      return value;
    },
    get writes() {
      return writes;
    },
  };
}
const first = {
  id: 10,
  nombre: "San Salvador",
  pais: "El Salvador",
  region: "San Salvador",
  latitud: 13.69,
  longitud: -89.19,
};
const second = {
  id: 11,
  nombre: "San Salvador",
  pais: "Argentina",
  region: null,
  latitud: -31.6,
  longitud: -58.5,
};

test("agrega, recupera, elimina y conserva homónimos por ID", () => {
  const storage = memoryStorage();
  assert.deepEqual(leerFavoritos(storage), []);
  assert.deepEqual(actualizarFavoritos(storage, first, "agregar"), [first]);
  assert.deepEqual(actualizarFavoritos(storage, second, "agregar"), [first, second]);
  assert.deepEqual(leerFavoritos(storage), [first, second]);
  assert.deepEqual(actualizarFavoritos(storage, first, "eliminar"), [second]);
  assert.deepEqual(leerFavoritos(storage), [second]);
  assert.equal(JSON.parse(storage.value).version, 1);
});

test("evita duplicados y escrituras innecesarias", () => {
  const storage = memoryStorage();
  actualizarFavoritos(storage, first, "agregar");
  actualizarFavoritos(storage, first, "agregar");
  actualizarFavoritos(storage, second, "eliminar");
  assert.equal(storage.writes, 1);
});

test("datos inválidos e incompletos no se sobrescriben", () => {
  for (const raw of [
    "{",
    JSON.stringify({ version: 1, ciudades: [{ id: 10 }] }),
    JSON.stringify({ version: 2, ciudades: [] }),
    JSON.stringify({ version: 1, ciudades: [first, first] }),
  ]) {
    const storage = memoryStorage(raw);
    assert.throws(() => leerFavoritos(storage), FavoritesError);
    assert.throws(() => actualizarFavoritos(storage, first, "agregar"), FavoritesError);
    assert.equal(storage.value, raw);
    assert.equal(storage.writes, 0);
  }
});

test("maneja errores de lectura y escritura", () => {
  assert.throws(
    () =>
      leerFavoritos({
        getItem() {
          throw new Error("denegado");
        },
      }),
    FavoritesError,
  );
  assert.throws(
    () =>
      actualizarFavoritos(
        {
          getItem: () => null,
          setItem() {
            throw new Error("cuota");
          },
        },
        first,
        "agregar",
      ),
    FavoritesError,
  );
  assert.throws(
    () => actualizarFavoritos(memoryStorage(), { ...first, latitud: 91 }, "agregar"),
    FavoritesError,
  );
});

test("identifica cambios relevantes de almacenamiento entre pestañas", () => {
  assert.equal(esEventoFavoritos(FAVORITES_KEY), true);
  assert.equal(esEventoFavoritos(null), true);
  assert.equal(esEventoFavoritos("otra-clave"), false);
  const shared = memoryStorage();
  actualizarFavoritos(shared, first, "agregar");
  assert.deepEqual(leerFavoritos(shared), [first]);
});

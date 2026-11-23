import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { consultarCiudades, esBusquedaValida, iniciarBusqueda } from "../src/lib/city-search.ts";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const cities = [
  {
    id: 1,
    nombre: "San Salvador",
    pais: "El Salvador",
    region: "San Salvador",
    latitud: 13.69,
    longitud: -89.19,
  },
  {
    id: 2,
    nombre: "San Salvador",
    pais: "Argentina",
    region: null,
    latitud: -31.62,
    longitud: -58.5,
  },
];

test("valida la longitud del término", () => {
  assert.equal(esBusquedaValida(" a "), false);
  assert.equal(esBusquedaValida("  San Salvador  "), true);
  assert.equal(esBusquedaValida("a".repeat(101)), false);
});

test("consulta resultados reales de la API interna y conserva ciudades homónimas", async () => {
  globalThis.fetch = async (url) => {
    assert.equal(url, "/api/ciudades?nombre=San+Salvador");
    return Response.json({ ciudades: cities });
  };
  const results = await consultarCiudades("San Salvador", new AbortController().signal);
  assert.deepEqual(results, cities);
  assert.notEqual(results[0].id, results[1].id);
});

test("maneja resultados vacíos y errores de API", async () => {
  globalThis.fetch = async () => Response.json({ ciudades: [] });
  assert.deepEqual(await consultarCiudades("zz", new AbortController().signal), []);
  globalThis.fetch = async () => new Response(null, { status: 503 });
  await assert.rejects(consultarCiudades("San", new AbortController().signal));
});

test("cancelación anterior aborta la solicitud y descarta respuestas obsoletas", async () => {
  let signal;
  let resolveRequest;
  const results = [];
  globalThis.fetch = (_url, options) => {
    signal = options.signal;
    return new Promise((resolve) => {
      resolveRequest = resolve;
    });
  };
  const cancel = iniciarBusqueda("San", (result) => results.push(result));
  await wait(400);
  assert.ok(signal);
  cancel();
  assert.equal(signal.aborted, true);
  resolveRequest(Response.json({ ciudades: cities }));
  await wait(20);
  assert.deepEqual(results, []);
});

test("publica errores y resultados tras el debounce", async () => {
  globalThis.fetch = async () => new Response(null, { status: 503 });
  const result = await new Promise((resolve) => iniciarBusqueda("San", resolve));
  assert.equal(result.status, "error");
  globalThis.fetch = async () => Response.json({ ciudades: [] });
  const empty = await new Promise((resolve) => iniciarBusqueda("San", resolve));
  assert.deepEqual(empty, { status: "success", ciudades: [] });
});

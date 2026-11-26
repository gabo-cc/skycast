import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { fotoVerificada } from "../src/lib/city-photo.ts";
import { obtenerFotoCiudad } from "../src/lib/unsplash-server.ts";
import { GET } from "../src/app/api/foto-ciudad/route.ts";

const originalFetch = globalThis.fetch;
const originalKey = process.env.UNSPLASH_ACCESS_KEY;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.UNSPLASH_ACCESS_KEY;
  else process.env.UNSPLASH_ACCESS_KEY = originalKey;
});

const city = {
  nombre: "San Salvador",
  pais: "El Salvador",
  region: null,
  latitud: 13.69,
  longitud: -89.19,
};
const detail = {
  location: {
    city: "San Salvador",
    country: "El Salvador",
    position: { latitude: 13.7, longitude: -89.2 },
  },
  urls: { small: "https://images.unsplash.com/photo-example?w=400" },
  user: { name: "Fotógrafa", links: { html: "https://unsplash.com/@ejemplo" } },
};

test("verifica ciudad y país, coordenadas y enlaces seguros antes de mostrar una foto", () => {
  const result = fotoVerificada(detail, city);
  assert.equal(result.fotografo, "Fotógrafa");
  assert.match(result.perfil, /utm_source=skycast/);
  const regular = "https://images.unsplash.com/photo-example?w=1080";
  assert.equal(fotoVerificada({ ...detail, urls: { ...detail.urls, regular } }, city).url, regular);
  assert.equal(
    fotoVerificada(
      { ...detail, urls: { ...detail.urls, regular: "https://evil.example/image" } },
      city,
    ).url,
    detail.urls.small,
  );
  assert.equal(
    fotoVerificada({ ...detail, location: { ...detail.location, country: "Argentina" } }, city),
    null,
  );
  assert.equal(
    fotoVerificada(
      { ...detail, location: { ...detail.location, position: { latitude: -31, longitude: -58 } } },
      city,
    ),
    null,
  );
  assert.equal(fotoVerificada({ ...detail, location: {} }, city), null);
  assert.equal(
    fotoVerificada({ ...detail, urls: { small: "https://evil.example/image" } }, city),
    null,
  );
  assert.equal(
    fotoVerificada(
      { ...detail, user: { ...detail.user, links: { html: "https://evil.example" } } },
      city,
    ),
    null,
  );
  assert.ok(fotoVerificada({ ...detail, location: { name: "San Salvador, El Salvador" } }, city));
  const regional = { ...city, region: "San Salvador" };
  assert.ok(fotoVerificada(detail, regional));
  assert.equal(
    fotoVerificada(
      {
        ...detail,
        location: {
          name: "San Salvador, La Libertad, El Salvador",
          position: detail.location.position,
        },
      },
      regional,
    ),
    null,
  );
  assert.equal(
    fotoVerificada(
      { ...detail, location: { name: "San Salvador, El Salvador" } },
      { ...regional, region: "San Miguel" },
    ),
    null,
  );
});

test("sin clave o país no consulta el proveedor y la ruta devuelve el respaldo", async () => {
  delete process.env.UNSPLASH_ACCESS_KEY;
  globalThis.fetch = () => {
    throw new Error("No debería consultar");
  };
  assert.equal(await obtenerFotoCiudad(city, undefined), null);
  assert.equal(await obtenerFotoCiudad({ ...city, pais: null }, "prueba"), null);
  const response = await GET(
    new Request(
      "http://localhost/api/foto-ciudad?nombre=San+Salvador&pais=El+Salvador&latitud=13.69&longitud=-89.19",
    ),
  );
  assert.deepEqual(await response.json(), { foto: null });
  const invalid = await GET(
    new Request("http://localhost/api/foto-ciudad?nombre=A&pais=El+Salvador&latitud=91&longitud=0"),
  );
  assert.equal(invalid.status, 400);
});

test("verifica detalles, comparte búsquedas concurrentes y reutiliza la respuesta sin divulgar la clave", async () => {
  const location = { ...city, nombre: "Ciudad de prueba", latitud: 1, longitud: 2 };
  const image = {
    ...detail,
    location: {
      city: location.nombre,
      country: location.pais,
      position: { latitude: 1, longitude: 2 },
    },
  };
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), authorization: options.headers.Authorization });
    return Response.json(
      String(url).includes("/search/") ? { results: [{ id: "photo1" }] } : image,
    );
  };
  const [first, second] = await Promise.all([
    obtenerFotoCiudad(location, "clave-de-prueba"),
    obtenerFotoCiudad(location, "clave-de-prueba"),
  ]);
  assert.deepEqual(first, second);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].authorization, "Client-ID clave-de-prueba");
  assert.ok(!JSON.stringify(first).includes("clave-de-prueba"));
  assert.deepEqual(await obtenerFotoCiudad(location, "clave-de-prueba"), first);
  assert.equal(calls.length, 2);
});

test("un error o resultados de otra ubicación mantienen el respaldo local", async () => {
  const other = { ...city, nombre: "Otra ciudad", latitud: 3, longitud: 4 };
  globalThis.fetch = async (url) =>
    Response.json(String(url).includes("/search/") ? { results: [{ id: "photo2" }] } : detail);
  assert.equal(await obtenerFotoCiudad(other, "prueba"), null);
  globalThis.fetch = async () => new Response(null, { status: 503 });
  assert.equal(
    await obtenerFotoCiudad({ ...other, nombre: "Ciudad sin servicio" }, "prueba"),
    null,
  );
});

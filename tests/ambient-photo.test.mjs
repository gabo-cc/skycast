import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { fotoAmbiental } from "../src/lib/city-photo.ts";
import { obtenerFotosAmbientales } from "../src/lib/unsplash-server.ts";
import { GET } from "../src/app/api/fotos-ambiente/route.ts";

const originalFetch = globalThis.fetch;
const originalKey = process.env.UNSPLASH_ACCESS_KEY;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.UNSPLASH_ACCESS_KEY;
  else process.env.UNSPLASH_ACCESS_KEY = originalKey;
});

const resultado = (image) => ({
  urls: { regular: `https://images.unsplash.com/${image}?w=1080` },
  user: { name: "Fotógrafa", links: { html: "https://unsplash.com/@fotografa" } },
});

test("valida las URLs y atribución sin exigir una ubicación geográfica", () => {
  const photo = fotoAmbiental(resultado("photo-1"));
  assert.equal(photo.fotografo, "Fotógrafa");
  assert.match(photo.perfil, /utm_source=skycast/);
  assert.match(photo.perfil, /utm_medium=referral/);
  assert.equal(
    fotoAmbiental({ ...resultado("photo-1"), urls: { regular: "https://evil.example/photo" } }),
    null,
  );
  assert.equal(
    fotoAmbiental({
      ...resultado("photo-1"),
      user: { name: "X", links: { html: "http://unsplash.com" } },
    }),
    null,
  );
  assert.equal(fotoAmbiental(null), null);
});

test("sin clave no consulta Unsplash y la ruta rechaza categorías desconocidas o repetidas", async () => {
  delete process.env.UNSPLASH_ACCESS_KEY;
  globalThis.fetch = () => {
    throw new Error("No debería consultar");
  };
  assert.deepEqual(await obtenerFotosAmbientales("sunny", undefined), []);
  const response = await GET(new Request("http://localhost/api/fotos-ambiente?categoria=sunny"));
  assert.deepEqual(await response.json(), { fotos: [] });
  for (const query of [
    "",
    "categoria=desconocida",
    "categoria=__proto__",
    "categoria=sunny&categoria=rain",
  ]) {
    const invalid = await GET(new Request(`http://localhost/api/fotos-ambiente?${query}`));
    assert.equal(invalid.status, 400);
  }
});

test("comparte una búsqueda ambiental y reutiliza candidatos seguros sin duplicados", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), authorization: options.headers.Authorization });
    return Response.json({
      results: [
        resultado("photo-1"),
        { ...resultado("photo-1"), urls: { regular: "https://images.unsplash.com/photo-1?w=400" } },
        resultado("photo-2"),
        { ...resultado("bad"), user: null },
      ],
    });
  };
  const [first, second] = await Promise.all([
    obtenerFotosAmbientales("cloudy", "clave-de-prueba"),
    obtenerFotosAmbientales("cloudy", "clave-de-prueba"),
  ]);
  assert.deepEqual(first, second);
  assert.equal(first.length, 2);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].authorization, "Client-ID clave-de-prueba");
  assert.match(new URL(calls[0].url).searchParams.get("query"), /cloudy landscape/);
  assert.ok(!JSON.stringify(first).includes("clave-de-prueba"));
  assert.deepEqual(await obtenerFotosAmbientales("cloudy", "clave-de-prueba"), first);
  assert.equal(calls.length, 1);
});

test("un fallo del proveedor se convierte en lista vacía y se guarda temporalmente", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response(null, { status: 429 });
  };
  assert.deepEqual(await obtenerFotosAmbientales("storm", "prueba"), []);
  assert.deepEqual(await obtenerFotosAmbientales("storm", "prueba"), []);
  assert.equal(calls, 1);
});

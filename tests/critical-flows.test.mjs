import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { GET as search } from "../src/app/api/ciudades/route.ts";
import { GET as weather } from "../src/app/api/clima/route.ts";
import { actualizarFavoritos, leerFavoritos } from "../src/lib/favorites-storage.ts";
import { forecastUrl, parseLocation } from "../src/lib/forecast-location.ts";
import { intercambiar, seleccionarCiudad } from "../src/lib/comparison.ts";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
test("flujo de búsqueda, favoritos, pronóstico, comparación y eliminación con proveedor simulado", async () => {
  let stored = null;
  const storage = {
    getItem: () => stored,
    setItem: (_key, value) => {
      stored = value;
    },
  };
  globalThis.fetch = async (url) => {
    if (url.hostname === "geocoding-api.open-meteo.com") {
      const madrid = url.searchParams.get("name") === "Madrid";
      return Response.json({
        results: [
          {
            id: madrid ? 2 : 1,
            name: madrid ? "Madrid" : "San Salvador",
            country: madrid ? "España" : "El Salvador",
            latitude: madrid ? 40.4 : 13.69,
            longitude: madrid ? -3.7 : -89.19,
          },
        ],
      });
    }
    const madrid = url.searchParams.get("latitude") === "40.4";
    return Response.json({
      timezone: madrid ? "Europe/Madrid" : "America/El_Salvador",
      utc_offset_seconds: madrid ? 3600 : -21600,
      current: { time: 1767283200, temperature_2m: madrid ? 10 : 25 },
      hourly: { time: [] },
      daily: { time: [] },
    });
  };
  const find = async (name) =>
    (
      await (
        await search(
          new Request(`http://localhost/api/ciudades?nombre=${encodeURIComponent(name)}`),
        )
      ).json()
    ).ciudades[0];
  const a = await find("San Salvador");
  const b = await find("Madrid");
  actualizarFavoritos(storage, a, "agregar");
  actualizarFavoritos(storage, b, "agregar");
  assert.deepEqual(leerFavoritos(storage), [a, b]);
  const parsed = parseLocation(new URL(forecastUrl(b), "http://localhost").searchParams);
  assert.deepEqual(parsed, b);
  const response = await weather(
    new Request(`http://localhost/api/clima?latitud=${parsed.latitud}&longitud=${parsed.longitud}`),
  );
  assert.equal((await response.json()).actual.temperatura, 10);
  const selected = seleccionarCiudad(seleccionarCiudad([null, null], 0, a), 1, b);
  assert.deepEqual(intercambiar(selected), [b, a]);
  actualizarFavoritos(storage, a, "eliminar");
  assert.deepEqual(leerFavoritos(storage), [b]);
});

import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { GET as ciudades } from "../src/app/api/ciudades/route.ts";
import { GET as clima } from "../src/app/api/clima/route.ts";
import { GET as climaInicio } from "../src/app/api/clima-inicio/route.ts";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});
const request = (path) => new Request(`http://localhost${path}`);
const weather = {
  timezone: "America/El_Salvador",
  utc_offset_seconds: -21600,
  current: {
    time: Date.parse("2026-01-01T18:00:00Z") / 1000,
    temperature_2m: 25,
    apparent_temperature: 26,
    relative_humidity_2m: 70,
    wind_speed_10m: 10,
    weather_code: 2,
    is_day: 1,
  },
  hourly: {
    time: [Date.parse("2026-01-01T18:00:00Z") / 1000],
    temperature_2m: [25],
    precipitation_probability: [null],
    weather_code: [2],
  },
  daily: {
    time: [Date.parse("2026-01-01T06:00:00Z") / 1000],
    temperature_2m_max: [29],
    temperature_2m_min: [20],
    precipitation_probability_max: [40],
    weather_code: [2],
  },
};

test("búsqueda válida conserva ciudades homónimas y parámetros del proveedor", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url.hostname, "geocoding-api.open-meteo.com");
    assert.equal(url.searchParams.get("language"), "es");
    assert.equal(options.cache, "no-store");
    return Response.json({
      results: [
        {
          id: 1,
          name: "San Salvador",
          country: "El Salvador",
          admin1: "San Salvador",
          latitude: 13.69,
          longitude: -89.19,
        },
        { id: 2, name: "San Salvador", latitude: 1, longitude: 2 },
      ],
    });
  };
  const response = await ciudades(request("/api/ciudades?nombre=San%20Salvador"));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.ciudades.length, 2);
  assert.equal(body.ciudades[1].pais, null);
});

test("búsqueda inválida y resultados vacíos", async () => {
  for (const query of ["", "?nombre=a", `?nombre=${"a".repeat(101)}`, "?nombre=ab&nombre=cd"]) {
    assert.equal((await ciudades(request(`/api/ciudades${query}`))).status, 400);
  }
  globalThis.fetch = async () => Response.json({});
  assert.deepEqual(await (await ciudades(request("/api/ciudades?nombre=zz"))).json(), {
    ciudades: [],
  });
});

test("coordenadas inválidas se rechazan antes de consultar", async () => {
  globalThis.fetch = async () => {
    throw new Error("no debe llamarse");
  };
  for (const query of [
    "",
    "?latitud=91&longitud=0",
    "?latitud=0&longitud=-181",
    "?latitud=NaN&longitud=0",
    "?latitud=Infinity&longitud=0",
    "?latitud=0x10&longitud=0",
    "?latitud=&longitud=0",
    "?latitud=0&latitud=1&longitud=0",
  ]) {
    assert.equal((await clima(request(`/api/clima${query}`))).status, 400);
  }
});

test("clima transforma horas locales y valores ausentes sin inventarlos", async () => {
  globalThis.fetch = async (url) => {
    assert.equal(url.hostname, "api.open-meteo.com");
    assert.equal(url.searchParams.get("timezone"), "auto");
    assert.equal(url.searchParams.get("timeformat"), "unixtime");
    assert.equal(url.searchParams.get("forecast_days"), "7");
    return Response.json(weather);
  };
  const response = await clima(request("/api/clima?latitud=13.69&longitud=-89.19"));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(body.zonaHoraria, "America/El_Salvador");
  assert.equal(body.actual.esDeDia, true);
  assert.equal(body.horas[0].hora, "2026-01-01T18:00:00.000Z");
  assert.equal(body.dias[0].fecha, "2026-01-01");
  assert.equal(body.horas[0].probabilidadPrecipitacion, null);
  assert.equal(body.dias[0].temperaturaMaxima, 29);
});

test("errores HTTP, JSON y estructuras inválidas del proveedor", async () => {
  for (const mock of [
    () => new Response("error", { status: 500 }),
    () => new Response("{", { status: 200 }),
    () => Response.json({ ...weather, hourly: { time: ["x"], temperature_2m: [] } }),
  ]) {
    globalThis.fetch = async () => mock();
    assert.equal((await clima(request("/api/clima?latitud=0&longitud=0"))).status, 502);
  }
  globalThis.fetch = async () => {
    throw new Error("red");
  };
  assert.equal((await clima(request("/api/clima?latitud=0&longitud=0"))).status, 503);
});

test("tiempo de espera agotado", async () => {
  const originalTimeout = AbortSignal.timeout;
  AbortSignal.timeout = () => AbortSignal.abort();
  try {
    globalThis.fetch = async (_url, { signal }) => {
      assert.equal(signal.aborted, true);
      throw signal.reason;
    };
    assert.equal((await clima(request("/api/clima?latitud=0&longitud=0"))).status, 504);
  } finally {
    AbortSignal.timeout = originalTimeout;
  }
});

test("clima de inicio conserva códigos seguros sin revelar detalles del proveedor", async () => {
  const url = request("/api/clima-inicio?latitud=0&longitud=0");
  globalThis.fetch = async () => {
    throw new Error("detalle privado del proveedor");
  };
  const unavailable = await climaInicio(url);
  assert.equal(unavailable.status, 503);
  assert.deepEqual(await unavailable.json(), { error: "No se pudo consultar el clima." });

  globalThis.fetch = async () => new Response("detalle privado", { status: 500 });
  const rejected = await climaInicio(url);
  assert.equal(rejected.status, 502);
  assert.deepEqual(await rejected.json(), { error: "No se pudo consultar el clima." });

  const originalTimeout = AbortSignal.timeout;
  AbortSignal.timeout = () => AbortSignal.abort();
  try {
    globalThis.fetch = async (_url, { signal }) => {
      throw signal.reason;
    };
    const timeout = await climaInicio(url);
    assert.equal(timeout.status, 504);
    assert.deepEqual(await timeout.json(), { error: "No se pudo consultar el clima." });
  } finally {
    AbortSignal.timeout = originalTimeout;
  }

  const invalid = await climaInicio(request("/api/clima-inicio?latitud=91&longitud=0"));
  assert.equal(invalid.status, 400);
  assert.deepEqual(await invalid.json(), { error: "Coordenadas inválidas." });
});

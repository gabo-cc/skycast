import { ApiError } from "../../../lib/open-meteo/errors.ts";
import { obtenerClima } from "../../../lib/open-meteo/service.ts";
import { validarCoordenadas } from "../../../lib/open-meteo/validation.ts";

export async function GET(request: Request) {
  let coordinates: { latitud: number; longitud: number };

  try {
    coordinates = validarCoordenadas(new URL(request.url).searchParams);
  } catch {
    return Response.json({ error: "Coordenadas inválidas." }, { status: 400 });
  }

  try {
    const weather = await obtenerClima(coordinates.latitud, coordinates.longitud);
    return Response.json(weather);
  } catch (error) {
    const status =
      error instanceof ApiError && (error.status === 503 || error.status === 504)
        ? error.status
        : 502;
    return Response.json({ error: "No se pudo consultar el clima." }, { status });
  }
}

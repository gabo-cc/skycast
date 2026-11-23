import { respuestaError } from "../../../lib/open-meteo/errors.ts";
import { buscarCiudades } from "../../../lib/open-meteo/service.ts";
import { validarNombre } from "../../../lib/open-meteo/validation.ts";

export async function GET(request: Request): Promise<Response> {
  try {
    const nombre = validarNombre(new URL(request.url).searchParams);
    return Response.json(
      { ciudades: await buscarCiudades(nombre) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return respuestaError(error);
  }
}

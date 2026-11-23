import { respuestaError } from "../../../lib/open-meteo/errors.ts";
import { obtenerClima } from "../../../lib/open-meteo/service.ts";
import { validarCoordenadas } from "../../../lib/open-meteo/validation.ts";

export async function GET(request: Request): Promise<Response> {
  try {
    const { latitud, longitud } = validarCoordenadas(new URL(request.url).searchParams);
    return Response.json(await obtenerClima(latitud, longitud), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return respuestaError(error);
  }
}

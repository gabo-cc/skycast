import { obtenerFotoCiudad } from "../../../lib/unsplash-server.ts";
import { validarCoordenadas, validarNombre } from "../../../lib/open-meteo/validation.ts";

export async function GET(request: Request): Promise<Response> {
  try {
    const params = new URL(request.url).searchParams;
    const nombre = validarNombre(params);
    const pais = params.get("pais")?.trim();
    const region = params.get("region")?.trim() || null;
    if (
      !pais ||
      pais.length > 100 ||
      (region && region.length > 100) ||
      ["pais", "region"].some((key) => params.getAll(key).length > 1)
    ) {
      return Response.json({ foto: null }, { status: 400 });
    }
    const city = { nombre, pais, region, ...validarCoordenadas(params) };
    const foto = await obtenerFotoCiudad(city, process.env.UNSPLASH_ACCESS_KEY);
    return Response.json({ foto }, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch {
    return Response.json({ foto: null }, { status: 400 });
  }
}

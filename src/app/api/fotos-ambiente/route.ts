import { esCategoriaAmbiental, obtenerFotosAmbientales } from "../../../lib/unsplash-server.ts";

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const categoria = params.get("categoria");
  if (!categoria || params.getAll("categoria").length !== 1 || !esCategoriaAmbiental(categoria)) {
    return Response.json({ fotos: [] }, { status: 400 });
  }
  const fotos = await obtenerFotosAmbientales(categoria, process.env.UNSPLASH_ACCESS_KEY);
  return Response.json({ fotos }, { headers: { "Cache-Control": "private, max-age=300" } });
}

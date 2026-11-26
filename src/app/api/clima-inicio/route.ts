import { NextResponse } from "next/server";
import { obtenerClima } from "@/lib/open-meteo/service";
import { validarCoordenadas } from "@/lib/open-meteo/validation";

export async function GET(request: Request) {
  let coordinates: { latitud: number; longitud: number };

  try {
    coordinates = validarCoordenadas(new URL(request.url).searchParams);
  } catch {
    return NextResponse.json({ error: "Coordenadas inválidas." }, { status: 400 });
  }

  try {
    const weather = await obtenerClima(coordinates.latitud, coordinates.longitud);
    return NextResponse.json(weather);
  } catch {
    return NextResponse.json({ error: "No se pudo consultar el clima." }, { status: 502 });
  }
}

import type { Ciudad } from "./open-meteo/types.ts";
import { esCiudadValida } from "./favorites-storage.ts";

export type SearchResult =
  { status: "success"; ciudades: Ciudad[] } | { status: "error"; message: string };

export function esBusquedaValida(nombre: string): boolean {
  const length = [...nombre.trim()].length;
  return length >= 2 && length <= 100;
}

export async function consultarCiudades(nombre: string, signal: AbortSignal): Promise<Ciudad[]> {
  const params = new URLSearchParams({ nombre });
  const response = await fetch(`/api/ciudades?${params}`, { signal });
  if (!response.ok) throw new Error("No fue posible buscar ciudades. Inténtalo de nuevo.");
  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("ciudades" in data) ||
    !Array.isArray(data.ciudades) ||
    !data.ciudades.every(esCiudadValida)
  ) {
    throw new Error("La respuesta de búsqueda no es válida. Inténtalo de nuevo.");
  }
  return data.ciudades;
}

export function iniciarBusqueda(
  nombre: string,
  onResult: (result: SearchResult) => void,
): () => void {
  const controller = new AbortController();
  let active = true;
  const timer = setTimeout(async () => {
    try {
      const ciudades = await consultarCiudades(nombre, controller.signal);
      if (active) onResult({ status: "success", ciudades });
    } catch {
      if (active && !controller.signal.aborted) {
        onResult({
          status: "error",
          message: "No fue posible buscar ciudades. Inténtalo de nuevo.",
        });
      }
    }
  }, 350);
  return () => {
    active = false;
    clearTimeout(timer);
    controller.abort();
  };
}

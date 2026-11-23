import { ApiError } from "./errors.ts";

function unico(params: URLSearchParams, key: string): string {
  const values = params.getAll(key);
  if (values.length !== 1 || !values[0].trim())
    throw new ApiError(400, `El parámetro ${key} es obligatorio y debe aparecer una sola vez.`);
  return values[0].trim();
}

export function validarNombre(params: URLSearchParams): string {
  const nombre = unico(params, "nombre");
  if ([...nombre].length < 2 || [...nombre].length > 100)
    throw new ApiError(400, "El nombre debe tener entre 2 y 100 caracteres.");
  return nombre;
}

export function validarCoordenadas(params: URLSearchParams): { latitud: number; longitud: number } {
  function coordinate(key: string, min: number, max: number): number {
    const input = unico(params, key);
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(input))
      throw new ApiError(400, `El parámetro ${key} debe ser un número válido.`);
    const value = Number(input);
    if (!Number.isFinite(value) || value < min || value > max)
      throw new ApiError(400, `El parámetro ${key} debe estar entre ${min} y ${max}.`);
    return value;
  }
  return { latitud: coordinate("latitud", -90, 90), longitud: coordinate("longitud", -180, 180) };
}

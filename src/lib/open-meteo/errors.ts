export class ApiError extends Error {
  readonly status: 400 | 502 | 503 | 504;

  constructor(status: 400 | 502 | 503 | 504, message: string) {
    super(message);
    this.status = status;
  }
}

export function respuestaError(error: unknown): Response {
  const known =
    error instanceof ApiError ? error : new ApiError(503, "Servicio temporalmente no disponible.");
  return Response.json(
    { error: known.message },
    { status: known.status, headers: { "Cache-Control": "no-store" } },
  );
}

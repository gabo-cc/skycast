/** Limita también la espera del cuerpo de la respuesta y cancela la operación al vencer. */
export async function conTiempoLimite<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  parentSignal: AbortSignal,
  timeoutMs = 12000,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;

  const interruption = new Promise<never>((_, reject) => {
    onAbort = () => {
      controller.abort();
      reject(new Error("La solicitud fue cancelada."));
    };
    if (parentSignal.aborted) {
      onAbort();
      return;
    }
    parentSignal.addEventListener("abort", onAbort, { once: true });
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error("La solicitud agotó el tiempo de espera."));
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation(controller.signal), interruption]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
    if (onAbort) parentSignal.removeEventListener("abort", onAbort);
  }
}

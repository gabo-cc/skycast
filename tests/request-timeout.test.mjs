import test from "node:test";
import assert from "node:assert/strict";
import { conTiempoLimite } from "../src/lib/request-timeout.ts";

test("limita una respuesta que no termina y aborta la operación", async () => {
  let signal;
  await assert.rejects(
    conTiempoLimite(
      (child) => {
        signal = child;
        return new Promise(() => {});
      },
      new AbortController().signal,
      15,
    ),
    /tiempo de espera/,
  );
  assert.equal(signal.aborted, true);
});

test("la cancelación externa interrumpe incluso una operación que ignora el abort", async () => {
  const controller = new AbortController();
  let signal;
  const request = conTiempoLimite(
    (child) => {
      signal = child;
      return new Promise(() => {});
    },
    controller.signal,
    1000,
  );
  controller.abort();
  await assert.rejects(request, /cancelada/);
  assert.equal(signal.aborted, true);
});

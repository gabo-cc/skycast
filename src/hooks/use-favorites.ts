"use client";

import { useCallback, useEffect, useState } from "react";
import {
  actualizarFavoritos,
  esEventoFavoritos,
  FavoritesError,
  leerFavoritos,
} from "@/lib/favorites-storage";
import type { Ciudad } from "@/lib/open-meteo/types";

type State = { status: "loading" | "ready" | "error"; cities: Ciudad[]; error: string | null };
const initial: State = { status: "loading", cities: [], error: null };

export function useFavorites() {
  const [state, setState] = useState<State>(initial);

  const reload = useCallback(() => {
    try {
      const cities = leerFavoritos(window.localStorage);
      setState({ status: "ready", cities, error: null });
    } catch (error) {
      setState((previous) => ({
        ...previous,
        status: "error",
        error:
          error instanceof FavoritesError
            ? error.message
            : "No se pudo acceder al almacenamiento del navegador.",
      }));
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) reload();
    });
    function onStorage(event: StorageEvent) {
      try {
        if (event.storageArea === window.localStorage && esEventoFavoritos(event.key)) reload();
      } catch {
        reload();
      }
    }
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
    };
  }, [reload]);

  function change(city: Ciudad, action: "agregar" | "eliminar") {
    if (state.status !== "ready") return;
    try {
      const cities = actualizarFavoritos(window.localStorage, city, action);
      setState({ status: "ready", cities, error: null });
    } catch (error) {
      setState((previous) => ({
        ...previous,
        status: "error",
        error:
          error instanceof FavoritesError
            ? error.message
            : "No se pudo acceder al almacenamiento del navegador.",
      }));
    }
  }

  return {
    ...state,
    reload,
    add: (city: Ciudad) => change(city, "agregar"),
    remove: (city: Ciudad) => change(city, "eliminar"),
  };
}

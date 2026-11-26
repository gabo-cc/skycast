"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useCityPhoto } from "@/components/city-photo";
import type { FotoCiudad } from "@/lib/city-photo";
import type { Ciudad } from "@/lib/open-meteo/types";
import {
  asignarPaisajes,
  categoriaPaisaje,
  opcionesPaisaje,
  type PaisajeAsignado,
} from "@/lib/weather-landscapes";

type Entry = {
  id: number;
  verificada: FotoCiudad | null;
  ambientales: readonly FotoCiudad[];
  locales: readonly string[];
};

type SceneContext = {
  assignments: Record<number, PaisajeAsignado>;
  update: (id: number, entry: Entry | null) => void;
};

const Context = createContext<SceneContext | null>(null);
const emptyPhotos: readonly FotoCiudad[] = [];
const requests = new Map<string, Promise<readonly FotoCiudad[]>>();

function obtenerAmbientales(category: string): Promise<readonly FotoCiudad[]> {
  const previous = requests.get(category);
  if (previous) return previous;
  const request = fetch(`/api/fotos-ambiente?categoria=${encodeURIComponent(category)}`)
    .then((response) => (response.ok ? response.json() : null))
    .then((data: { fotos?: FotoCiudad[] } | null) =>
      Array.isArray(data?.fotos) ? data.fotos : emptyPhotos,
    )
    .catch(() => emptyPhotos);
  requests.set(category, request);
  setTimeout(() => {
    if (requests.get(category) === request) requests.delete(category);
  }, 5 * 60_000);
  return request;
}

export function ScenePhotoProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Record<number, Entry>>({});
  const update = useCallback((id: number, entry: Entry | null) => {
    setEntries((previous) => {
      if (entry) return { ...previous, [id]: entry };
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }, []);
  const assignments = useMemo(() => asignarPaisajes(Object.values(entries)), [entries]);
  const value = useMemo(() => ({ assignments, update }), [assignments, update]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useScenePhoto(city: Ciudad, code: number | null, isDay: boolean | null) {
  const verified = useCityPhoto(city);
  const context = useContext(Context);
  const [ambient, setAmbient] = useState<{
    category: string;
    photos: readonly FotoCiudad[];
  } | null>(null);
  const [failedCategories, setFailedCategories] = useState<readonly string[]>([]);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const category = categoriaPaisaje(code, isDay);
  const enabled = verified.resolved && !verified.photo && category !== null;
  useEffect(() => {
    if (!enabled || !category) return;
    let active = true;
    obtenerAmbientales(category).then((photos) => {
      if (active) setAmbient({ category, photos });
    });
    return () => {
      active = false;
    };
  }, [category, enabled]);

  const candidates =
    enabled && ambient?.category === category && !failedCategories.includes(category)
      ? ambient.photos
      : emptyPhotos;
  const locales = opcionesPaisaje(code, isDay);
  const update = context?.update;
  useEffect(() => {
    if (!update) return;
    update(city.id, { id: city.id, verificada: verified.photo, ambientales: candidates, locales });
    return () => update(city.id, null);
  }, [update, city.id, verified.photo, candidates, locales]);

  const selection = context?.assignments[city.id];
  const photo = selection ? selection.foto : verified.photo;
  const isVerified = photo !== null && photo.url === verified.photo?.url;
  const loaded = isVerified ? verified.loaded : !!photo && loadedUrl === photo.url;
  return {
    photo,
    loaded,
    illustrative: !isVerified,
    landscape: selection?.paisaje ?? null,
    onLoad: () => {
      if (isVerified) verified.onLoad();
      else if (photo) setLoadedUrl(photo.url);
    },
    onError: () => {
      if (isVerified) verified.onError();
      else if (photo && category) setFailedCategories((previous) => [...previous, category]);
    },
  };
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FotoCiudad } from "@/lib/city-photo";
import type { Ciudad } from "@/lib/open-meteo/types";

const requests = new Map<string, Promise<FotoCiudad | null>>();

function obtenerFoto(params: string): Promise<FotoCiudad | null> {
  const previous = requests.get(params);
  if (previous) return previous;
  if (requests.size >= 256) requests.delete(requests.keys().next().value as string);
  const request = fetch(`/api/foto-ciudad?${params}`)
    .then((response) => (response.ok ? response.json() : null))
    .then((data: { foto?: FotoCiudad | null } | null) => data?.foto ?? null)
    .catch(() => null);
  requests.set(params, request);
  // La caché de la sesión evita consultas repetidas al navegar y al intercambiar ciudades.
  setTimeout(() => {
    if (requests.get(params) === request) requests.delete(params);
  }, 5 * 60_000);
  return request;
}

export function useCityPhoto(city: Ciudad) {
  const [result, setResult] = useState<{
    key: string;
    photo: FotoCiudad | null;
    loaded: boolean;
  } | null>(null);
  const { nombre, pais, region, latitud, longitud } = city;
  const params = pais
    ? new URLSearchParams({
        nombre,
        pais,
        latitud: String(latitud),
        longitud: String(longitud),
        ...(region ? { region } : {}),
      }).toString()
    : null;

  useEffect(() => {
    if (!params) return;
    let active = true;
    obtenerFoto(params).then((photo) => {
      if (active) setResult({ key: params, photo, loaded: false });
    });
    return () => {
      active = false;
    };
  }, [params]);

  const current = result?.key === params ? result : null;
  const photo = current?.photo ?? null;
  function onLoad() {
    setResult((previous) =>
      previous?.key === params && previous.photo?.url === photo?.url
        ? { ...previous, loaded: true }
        : previous,
    );
  }
  function onError() {
    setResult((previous) =>
      previous?.key === params && previous.photo?.url === photo?.url
        ? { ...previous, photo: null, loaded: false }
        : previous,
    );
  }

  return {
    photo,
    loaded: current?.loaded ?? false,
    resolved: !params || current !== null,
    onLoad,
    onError,
  };
}

export function CityPhotoBackground({
  photo,
  loaded,
  onLoad,
  onError,
}: {
  photo: FotoCiudad;
  loaded: boolean;
  onLoad: () => void;
  onError: () => void;
}) {
  return (
    <Image
      src={photo.url}
      alt=""
      fill
      unoptimized
      loading="lazy"
      sizes="(max-width: 768px) 100vw, 50vw"
      className={`city-photo-background ${loaded ? "is-loaded" : ""}`}
      onLoad={onLoad}
      onError={onError}
    />
  );
}

export function CityPhotoCredit({ photo }: { photo: FotoCiudad | null }) {
  if (!photo) return null;
  return (
    <p className="city-photo-credit">
      <span className="sr-only">Fotografía de archivo. </span>
      Foto:{" "}
      <a href={photo.perfil} target="_blank" rel="noopener noreferrer">
        {photo.fotografo}
      </a>{" "}
      ·{" "}
      <a
        href="https://unsplash.com/?utm_source=skycast&utm_medium=referral"
        target="_blank"
        rel="noopener noreferrer"
      >
        Unsplash
      </a>
    </p>
  );
}

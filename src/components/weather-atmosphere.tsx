import { clasificarAmbiente } from "@/lib/weather-atmosphere";
import { AtmosphericEffects } from "@/components/atmospheric-effects";
import { paisajeMeteorologico } from "@/lib/weather-landscapes";
import type { Ciudad } from "@/lib/open-meteo/types";
import type { ReactNode } from "react";

type WeatherAtmosphereProps = {
  code: number | null;
  isDay: boolean | null;
  city?: Pick<Ciudad, "id" | "latitud" | "longitud">;
  landscape?: string | null;
  children?: ReactNode;
};

export function WeatherAtmosphere({
  code,
  isDay,
  city,
  landscape: selected,
  children,
}: WeatherAtmosphereProps) {
  const kind = clasificarAmbiente(code, isDay);
  const landscape = selected ?? (city ? paisajeMeteorologico(city, code, isDay) : null);

  return (
    <div aria-hidden="true" className={`weather-atmosphere atmosphere-${kind}`}>
      <div
        className="weather-photo"
        style={landscape ? { backgroundImage: `url("${landscape}")` } : undefined}
      />
      {children}

      <div className="weather-ambient-light" />

      <div className="weather-photo-overlay" />
      <AtmosphericEffects kind={kind} />
    </div>
  );
}

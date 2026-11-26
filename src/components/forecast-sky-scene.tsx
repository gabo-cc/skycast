import { clasificarAmbiente, type WeatherAtmosphereKind } from "@/lib/weather-atmosphere";
import { AtmosphericEffects } from "@/components/atmospheric-effects";

type ForecastSkySceneProps = {
  code: number | null;
  isDay: boolean | null;
};

const descriptions: Record<WeatherAtmosphereKind, string> = {
  sunny: "Un cielo lleno de luz",
  "partly-cloudy": "Nubes y claros en el horizonte",
  cloudy: "Nubes sobre el horizonte",
  drizzle: "Llovizna sobre el paisaje",
  rain: "La lluvia transforma el paisaje",
  storm: "Un cielo de tormenta",
  "clear-night": "Una noche bajo las estrellas",
  "cloudy-night": "La calma de la noche",
  neutral: "El cielo de tu ciudad",
};

export function ForecastSkyScene({ code, isDay }: ForecastSkySceneProps) {
  const kind = clasificarAmbiente(code, isDay);

  return (
    <div className={`fsky-scene fsky-${kind}`} aria-label={descriptions[kind]}>
      <div className="fsky-photo" aria-hidden="true" />

      <div className="fsky-shade" aria-hidden="true" />

      <AtmosphericEffects kind={kind} />

      <div className="fsky-caption">
        <span className="fsky-caption-dot" />
        <span>{descriptions[kind]}</span>
      </div>
    </div>
  );
}

type SkyKind = "sunny" | "cloudy" | "rain" | "storm" | "clear-night" | "cloudy-night" | "neutral";

type ForecastSkySceneProps = {
  code: number | null;
  isDay: boolean | null;
};

function getSkyKind(code: number | null, isDay: boolean | null): SkyKind {
  if (code === null || isDay === null) {
    return "neutral";
  }

  if (code >= 95) return "storm";

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return "rain";
  }

  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return "cloudy";
  }

  if (!isDay) {
    return code <= 1 ? "clear-night" : "cloudy-night";
  }

  return code <= 1 ? "sunny" : "cloudy";
}

const descriptions: Record<SkyKind, string> = {
  sunny: "Un cielo lleno de luz",
  cloudy: "Nubes sobre el horizonte",
  rain: "La lluvia transforma el paisaje",
  storm: "Un cielo de tormenta",
  "clear-night": "Una noche bajo las estrellas",
  "cloudy-night": "La calma de la noche",
  neutral: "El cielo de tu ciudad",
};

export function ForecastSkyScene({ code, isDay }: ForecastSkySceneProps) {
  const kind = getSkyKind(code, isDay);

  const showStars = kind === "clear-night";
  const showClouds =
    kind === "cloudy" || kind === "cloudy-night" || kind === "rain" || kind === "storm";

  const showRain = kind === "rain" || kind === "storm";

  return (
    <div className={`fsky-scene fsky-${kind}`} aria-label={descriptions[kind]}>
      <div className="fsky-photo" aria-hidden="true" />

      <div className="fsky-shade" aria-hidden="true" />

      {kind === "sunny" && <span className="fsky-sunlight" aria-hidden="true" />}

      {showStars && (
        <div className="fsky-stars" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <span key={index} className={`fsky-star fsky-star-${index + 1}`} />
          ))}

          <span className="fsky-meteor fsky-meteor-one" />
          <span className="fsky-meteor fsky-meteor-two" />
        </div>
      )}

      {showClouds && (
        <div className="fsky-clouds" aria-hidden="true">
          <span className="fsky-cloud fsky-cloud-one" />
          <span className="fsky-cloud fsky-cloud-two" />
        </div>
      )}

      {showRain && <div className="fsky-rain" aria-hidden="true" />}

      <div className="fsky-caption">
        <span className="fsky-caption-dot" />
        <span>{descriptions[kind]}</span>
      </div>
    </div>
  );
}

import { clasificarAmbiente } from "@/lib/weather-atmosphere";

type WeatherAtmosphereProps = {
  code: number | null;
  isDay: boolean | null;
};

export function WeatherAtmosphere({ code, isDay }: WeatherAtmosphereProps) {
  const kind = clasificarAmbiente(code, isDay);

  const isRainy = kind === "drizzle" || kind === "rain" || kind === "storm";

  const isMisty = kind === "cloudy" || kind === "drizzle" || kind === "cloudy-night";

  return (
    <div aria-hidden="true" className={`weather-atmosphere atmosphere-${kind}`}>
      <div className="weather-photo" />

      <div className="weather-ambient-light" />

      {isMisty && <div className="weather-mist" />}

      {isRainy && (
        <div className="weather-rainfall">
          <span className="rain-layer rain-layer-back" />
          <span className="rain-layer rain-layer-front" />
        </div>
      )}

      <div className="weather-photo-overlay" />
    </div>
  );
}

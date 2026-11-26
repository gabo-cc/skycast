import { capasAmbiente, type WeatherAtmosphereKind } from "@/lib/weather-atmosphere";

export function AtmosphericEffects({ kind }: { kind: WeatherAtmosphereKind }) {
  const layers = capasAmbiente(kind);

  return (
    <div className="sky-effects" aria-hidden="true">
      {layers.sol && <span className="sky-effects-sun" />}
      {layers.luna && <span className="sky-effects-moon" />}
      {layers.estrellas && (
        <div className="sky-effects-stars">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} className={`sky-effects-star sky-effects-star-${index + 1}`} />
          ))}
          <span className="sky-effects-meteor sky-effects-meteor-one" />
          <span className="sky-effects-meteor sky-effects-meteor-two" />
        </div>
      )}
      {layers.nubes && (
        <div className="sky-effects-clouds">
          <span className="sky-effects-cloud sky-effects-cloud-back" />
          <span className="sky-effects-cloud sky-effects-cloud-front" />
        </div>
      )}
      {layers.lluvia && (
        <div className={`sky-effects-rain sky-effects-rain-${layers.lluvia}`}>
          <span className="sky-effects-raindrops sky-effects-raindrops-back" />
          <span className="sky-effects-raindrops sky-effects-raindrops-front" />
        </div>
      )}
    </div>
  );
}

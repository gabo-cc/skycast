export function WeatherAttribution() {
  return (
    <>
      <a href="https://open-meteo.com/" className="underline underline-offset-2">
        Open-Meteo
      </a>
      {" · datos adaptados, "}
      <a
        href="https://creativecommons.org/licenses/by/4.0/"
        className="underline underline-offset-2"
      >
        CC BY 4.0
      </a>
    </>
  );
}

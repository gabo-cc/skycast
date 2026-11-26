import { HomeDashboard } from "@/components/home-dashboard";
import { DEFAULT_LOCATION } from "@/lib/forecast-location";
import { obtenerClima } from "@/lib/open-meteo/service";

export default async function Home() {
  const weather = await obtenerClima(DEFAULT_LOCATION.latitud, DEFAULT_LOCATION.longitud);

  return <HomeDashboard initialWeather={weather} />;
}

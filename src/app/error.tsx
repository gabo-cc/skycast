"use client";
import { WeatherError } from "@/components/weather-error";
export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <WeatherError retry={retry} />;
}

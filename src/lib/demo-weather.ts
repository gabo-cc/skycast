export type WeatherCondition = "sun" | "cloud" | "rain";
export type CityWeather = {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  icon: WeatherCondition;
  high: number;
  low: number;
  humidity: number;
  wind: number;
};
export const cities: CityWeather[] = [
  {
    city: "San Salvador",
    country: "El Salvador",
    temperature: 26,
    condition: "Parcialmente nublado",
    icon: "cloud",
    high: 29,
    low: 20,
    humidity: 68,
    wind: 12,
  },
  {
    city: "Ciudad de México",
    country: "México",
    temperature: 22,
    condition: "Soleado",
    icon: "sun",
    high: 25,
    low: 15,
    humidity: 52,
    wind: 9,
  },
  {
    city: "Madrid",
    country: "España",
    temperature: 19,
    condition: "Lluvia ligera",
    icon: "rain",
    high: 21,
    low: 13,
    humidity: 74,
    wind: 14,
  },
];
export const hourly = [
  { time: "09:00", icon: "sun", temperature: 23 },
  { time: "12:00", icon: "sun", temperature: 28 },
  { time: "15:00", icon: "cloud", temperature: 26 },
  { time: "18:00", icon: "cloud", temperature: 24 },
  { time: "21:00", icon: "rain", temperature: 22 },
] satisfies { time: string; icon: WeatherCondition; temperature: number }[];
export const daily = [
  { day: "Lunes", icon: "sun", condition: "Soleado", high: 29, low: 20 },
  { day: "Martes", icon: "cloud", condition: "Parcialmente nublado", high: 28, low: 21 },
  { day: "Miércoles", icon: "rain", condition: "Lluvia ligera", high: 26, low: 20 },
  { day: "Jueves", icon: "cloud", condition: "Nublado", high: 27, low: 19 },
  { day: "Viernes", icon: "sun", condition: "Soleado", high: 30, low: 20 },
] satisfies { day: string; icon: WeatherCondition; condition: string; high: number; low: number }[];

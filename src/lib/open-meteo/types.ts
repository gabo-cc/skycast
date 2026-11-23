export type Ciudad = {
  id: number;
  nombre: string;
  pais: string | null;
  region: string | null;
  latitud: number;
  longitud: number;
};

export type Clima = {
  zonaHoraria: string;
  desfaseUtcSegundos: number;
  unidades: { temperatura: "°C"; viento: "km/h"; humedad: "%"; precipitacion: "%" };
  actual: {
    hora: string | null;
    temperatura: number | null;
    sensacionTermica: number | null;
    humedad: number | null;
    viento: number | null;
    codigoMeteorologico: number | null;
    esDeDia: boolean | null;
  } | null;
  horas: {
    hora: string;
    temperatura: number | null;
    probabilidadPrecipitacion: number | null;
    codigoMeteorologico: number | null;
  }[];
  dias: {
    fecha: string;
    temperaturaMaxima: number | null;
    temperaturaMinima: number | null;
    probabilidadPrecipitacionMaxima: number | null;
    codigoMeteorologico: number | null;
  }[];
};

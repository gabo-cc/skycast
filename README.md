# SkyCast

Aplicación meteorológica académica construida con Next.js, React, TypeScript y Tailwind CSS. Permite buscar ciudades, consultar el pronóstico de Open-Meteo, guardar favoritos en el navegador y comparar dos ubicaciones.

## Desarrollo

Se utiliza exclusivamente pnpm. Open-Meteo no requiere clave; las fotografías de ciudades son opcionales.

```sh
pnpm install
pnpm dev
```

Abrir `http://localhost:3000`. Para verificar el proyecto:

```sh
pnpm format:check
pnpm lint
pnpm test
pnpm build
pnpm encoding:check
```

Los favoritos se almacenan en `localStorage` del navegador. Los agregados diarios de Open-Meteo usan el desplazamiento vigente al consultar y pueden abarcar horas distintas del día local durante una transición de horario de verano. El proceso de desarrollo y sus verificaciones se documentan en `VIBE_CODING.md`.

## Fotografías de ciudades

Favoritos y Comparar pueden mostrar como fondo una fotografía de archivo verificable de la ciudad o un paisaje ambiental de Unsplash relacionado con el clima, ambos con créditos visibles. Los paisajes ambientales se identifican como ilustrativos y no representan la ciudad ni las condiciones actuales. Si no hay fotografías disponibles, se usan los recursos originales y las [variantes generadas por IA](docs/paisajes-generados.md) optimizadas en WebP. Inicio y Pronóstico conservan sus paisajes existentes.

La selección coordinada considera la identidad de las ciudades, la condición meteorológica y el día o la noche, incluida la nieve. Da prioridad a vistas verificadas y distribuye las alternativas ambientales y locales para evitar repeticiones cuando es posible; puede utilizar un recurso local para reservar una imagen compartida a otra ciudad. La asignación es estable con el mismo conjunto de ciudades y candidatos, y puede cambiar cuando cambian el clima o los resultados tras vencer la caché. Si faltan alternativas suficientes, algunas ciudades pueden coincidir. Sin condición o indicador de día se usa el fondo neutro.

Para habilitarlas, registra una aplicación en [Unsplash Developers](https://unsplash.com/developers), copia `.env.example` a `.env.local`, configura `UNSPLASH_ACCESS_KEY` con la clave de acceso y reinicia el servidor. La clave permanece en el servidor; no uses el prefijo `NEXT_PUBLIC_`. Si no hay una coincidencia verificable se buscan paisajes genéricos; sin clave o ante errores se conserva el respaldo local.

La búsqueda de vistas urbanas incluye ciudad, región y país; se revisan como máximo tres resultados y se consulta su ubicación detallada. Se comprueba la ciudad y el país; cuando existe región, debe coincidir con el nombre de ubicación. Si la ubicación no menciona otra zona, también se puede corroborar con coordenadas próximas. Si la ubicación incluye coordenadas, deben encontrarse a menos de 50 km. Esta comprobación es deliberadamente conservadora: los nombres traducidos o los metadatos incompletos pueden impedir mostrar una fotografía. Para paisajes ilustrativos se comparten candidatos buscados en inglés por categoría meteorológica, sin atribuirles la ubicación de la ciudad.

El servidor reutiliza respuestas del proveedor durante 24 horas, deduplica consultas simultáneas y conserva resultados en memoria durante 24 horas (o cinco minutos si no hay resultado). Limita a dos búsquedas concurrentes y 40 llamadas por hora por proceso; estos límites de memoria no son globales entre instancias ni sobreviven reinicios. El navegador también reutiliza consultas durante cinco minutos. Las imágenes usan la variante regular entregada directamente por Unsplash, o la reducida si la primera no está disponible, y muestran enlaces al fotógrafo y al servicio.

La [API de Unsplash](https://unsplash.com/documentation) requiere una clave, limita inicialmente el modo de demostración a 50 solicitudes por hora y exige atribución y enlace directo a las imágenes, según sus [directrices](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines). Para producción se debe revisar su aprobación y condiciones. [Pexels](https://www.pexels.com/api/documentation/) es una alternativa con clave y límites predeterminados de 200 solicitudes por hora y 20 000 al mes; exige un enlace visible a Pexels y recomienda acreditar al fotógrafo. Esta implementación utiliza únicamente Unsplash.

# SkyCast 2.0

Aplicación meteorológica académica para explorar el tiempo, consultar pronósticos y comparar ciudades. Los datos meteorológicos proceden de Open-Meteo; las fotografías opcionales de Unsplash se presentan como imágenes de archivo.

## Características principales

- Inicio cinematográfico con ciudad principal configurable y selección de horas.
- Búsqueda de ciudades y navegación al pronóstico conservando su identidad y coordenadas.
- Pronósticos horarios y diarios, gráfica interactiva y fechas en la zona horaria de la ciudad.
- Favoritos persistentes y comparación de dos ciudades con solicitudes y reintentos independientes.
- Escenas y efectos atmosféricos, temas claro, oscuro y automático, y soporte para movimiento reducido.
- Fotografías verificadas de ciudades, paisajes ilustrativos y recursos locales de respaldo.

La ciudad principal, los favoritos y la preferencia de tema se guardan en el almacenamiento del navegador. No se sincronizan automáticamente entre dispositivos.

## Tecnologías

Next.js 16, React 19, TypeScript, Tailwind CSS 4 y pnpm. Las pruebas usan el ejecutor integrado de Node.js.

## Requisitos

- Node.js 20.9.0 o posterior, requisito de la versión instalada de Next.js. La auditoría local se ejecutó con Node.js 22.14.0.
- pnpm 12.9.1, especificado en `package.json`.
- Conexión a Internet para consultar Open-Meteo y, opcionalmente, Unsplash.

## Instalación

```powershell
pnpm.cmd install --frozen-lockfile
```

En otros sistemas puede utilizarse `pnpm` en lugar de `pnpm.cmd`.

## Variables de entorno

Open-Meteo no necesita clave para la integración actual. Unsplash es opcional: registra una aplicación en [Unsplash Developers](https://unsplash.com/developers) y obtén su Access Key.

Si todavía no existe `.env.local`, crea una copia de ejemplo:

```powershell
Copy-Item .env.example .env.local
```

Edita `.env.local` y asigna la clave a `UNSPLASH_ACCESS_KEY`; reinicia el servidor después de cambiarla. No sobrescribas un archivo existente con otras variables. La clave solo se usa en el servidor: no la incluyas en el repositorio ni uses el prefijo `NEXT_PUBLIC_`. `.env.local` está excluido por `.gitignore`.

## Desarrollo

```powershell
pnpm.cmd dev
```

Abre `http://localhost:3000`. Las rutas principales son Inicio, Buscar, Pronóstico, Favoritos, Comparar y Acerca de.

## Validaciones

```powershell
pnpm.cmd format
pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd encoding:check
pnpm.cmd exec tsc --noEmit
pnpm.cmd test
```

`format` modifica los archivos que requieren formato; `format:check` solo comprueba. Las pruebas de servicios externos emplean respuestas simuladas y no sustituyen una revisión en navegador.

## Estructura general

```text
src/app/                 Páginas y Route Handlers
src/components/          Interfaz y escenas interactivas
src/hooks/               Hooks compartidos
src/lib/                 Servicios, transformación y lógica
public/weather/          Paisajes locales WebP
tests/                   Pruebas automatizadas
docs/                    Historial, recursos y auditoría QA
```

## Open-Meteo y Unsplash

Open-Meteo proporciona geocodificación, condiciones actuales y pronósticos. El servicio valida entradas y respuestas, fija un tiempo de espera y muestra los datos faltantes como no disponibles. La API gratuita está destinada a uso no comercial; consulta sus [condiciones y límites](https://open-meteo.com/en/terms) antes de publicar.

Favoritos y Comparar pueden utilizar una fotografía de archivo de Unsplash como portada. Una vista presentada como fotografía de la ciudad se verifica mediante ciudad, país y, cuando corresponde, región o coordenadas cercanas. Esta validación conservadora puede descartar nombres traducidos o metadatos incompletos.

Cuando no hay una vista verificable, se buscan paisajes genéricos por condición meteorológica, identificados como **«Paisaje ilustrativo»**: no representan la ciudad ni sus condiciones actuales. Las imágenes de Unsplash se sirven desde su CDN y muestran créditos enlazados al fotógrafo y a Unsplash. Se conservan los paisajes locales originales y las [variantes generadas](docs/paisajes-generados.md) en WebP para fallos o ausencia de clave. Inicio y Pronóstico usan sus escenas locales.

La selección coordinada intenta evitar imágenes repetidas y es estable con las mismas ciudades y candidatas; puede cambiar si cambia el clima, el conjunto visible o los resultados tras vencer la caché. El servidor deduplica solicitudes, limita dos búsquedas concurrentes y 40 llamadas por hora por proceso, y guarda resultados durante 24 horas o cinco minutos si no hay resultado. El navegador reutiliza consultas durante cinco minutos. Los límites en memoria no se comparten entre instancias ni sobreviven reinicios.

La [documentación de Unsplash](https://unsplash.com/documentation) describe la cuota del modo de demostración, la atribución y el uso directo de imágenes; revisa sus requisitos y la aprobación de producción antes de publicar.

## Capturas o demostración

No hay capturas ni una URL de demostración versionadas en el proyecto. La aplicación puede revisarse localmente con el comando de desarrollo.

## Despliegue en Vercel

Para preparar un despliegue futuro, importa el repositorio en Vercel y selecciona la configuración de Next.js. En **Project Settings → Environment Variables**, agrega opcionalmente `UNSPLASH_ACCESS_KEY` como variable de servidor para los entornos necesarios. No uses `NEXT_PUBLIC_` ni publiques el valor.

Los cambios de variables se aplican a nuevos despliegues, según la [documentación de Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables). Estas instrucciones no implican que el proyecto esté desplegado ni autorizan un despliegue.

## Limitaciones conocidas

- Los agregados diarios de Open-Meteo usan el desplazamiento vigente al consultar y pueden abarcar horas distintas del día local durante una transición de horario de verano.
- Las fotos verificadas dependen de metadatos completos y la disponibilidad y cuota del proveedor; las fotografías son de archivo, no observaciones actuales.
- Si no hay suficientes candidatas ambientales o locales, algunas ciudades pueden compartir paisaje. Los límites de Unsplash son por proceso, no globales entre instancias.
- Los servicios externos pueden fallar o limitar solicitudes; la aplicación muestra estados de error y utiliza respaldos cuando corresponde.

## Metodología Vibe Coding

La [bitácora de desarrollo](VIBE_CODING.md) resume objetivos, decisiones y pruebas por iteración. Los prompts y anotaciones disponibles antes de su reorganización se conservan en el [historial original](docs/historial-prompts-originales.md). Los resultados y pendientes de esta revisión se documentan en [QA final](docs/qa-final.md).

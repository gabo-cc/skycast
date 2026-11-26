# SkyCast 2.0

**Aplicación meteorológica interactiva desarrollada como proyecto académico mediante Vibe Coding.** Permite consultar el tiempo actual, explorar pronósticos, guardar ciudades favoritas y comparar las condiciones de dos ubicaciones en una interfaz visual y adaptable a diferentes dispositivos.

SkyCast utiliza **Open-Meteo** para obtener datos meteorológicos y, opcionalmente, **Unsplash** para mostrar fotografías de ciudades y paisajes. Incorpora escenas y recursos locales como respaldo.

> **Alcance:** proyecto educativo, sin fines comerciales, previsto para demostraciones controladas y tráfico reducido. Su uso debe respetar los términos, las cuotas y los requisitos de atribución de los proveedores externos.

## Características principales

- **Inicio interactivo:** ciudad principal configurable, condiciones actuales y exploración del pronóstico por horas.
- **Búsqueda de ciudades:** resultados con ubicación identificable y acceso directo al pronóstico.
- **Pronósticos:** datos horarios y diarios, gráfica interactiva y presentación de la hora local de cada ciudad.
- **Favoritos:** ciudades guardadas en el navegador, información meteorológica y acceso rápido a sus pronósticos.
- **Comparación:** consulta de dos ciudades, intercambio de posiciones y métricas meteorológicas comparables.
- **Experiencia visual:** ambientes meteorológicos animados, modo claro, oscuro y automático, y compatibilidad con la preferencia de movimiento reducido.
- **Fotografías y paisajes:** vistas de ciudades verificadas cuando están disponibles, fotografías ambientales identificadas como ilustrativas y fondos WebP locales de respaldo.

La ciudad principal, los favoritos y la preferencia de tema se almacenan localmente en el navegador. **No se sincronizan automáticamente entre dispositivos.**

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| Next.js 16 (App Router) | Aplicación web y rutas API internas |
| React 19 | Componentes e interactividad |
| TypeScript | Tipado estático |
| Tailwind CSS 4 y CSS | Estilos y diseño adaptable |
| Open-Meteo | Geocodificación y datos meteorológicos |
| Unsplash (opcional) | Fotografías de ciudades y paisajes |
| pnpm | Gestión de dependencias |
| Node.js Test Runner | Pruebas automatizadas |

## Requisitos previos

Antes de instalar el proyecto, necesitas:

- **Git** para clonar el repositorio.
- **Node.js 20.9.0 o posterior**. El proyecto se verificó localmente con Node.js **22.14.0**.
- **pnpm 12.9.1**, la versión indicada en `package.json`.
- Conexión a Internet para las consultas meteorológicas y, si se habilita, las fotografías de Unsplash.

Comprueba las versiones instaladas:

**Windows (PowerShell):**

```powershell
node --version
pnpm.cmd --version
git --version
```

**Linux o macOS:**

```bash
node --version
pnpm --version
git --version
```

> En los comandos siguientes se utiliza `pnpm.cmd` en Windows porque PowerShell puede bloquear el script `pnpm.ps1`. En Linux y macOS sustituye `pnpm.cmd` por `pnpm`.

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/gabo-cc/skycast.git
cd skycast
```

### 2. Instalar las dependencias

**Windows (PowerShell):**

```powershell
pnpm.cmd install --frozen-lockfile
```

**Linux o macOS:**

```bash
pnpm install --frozen-lockfile
```

La opción `--frozen-lockfile` instala las versiones registradas en el archivo de bloqueo sin modificarlo.

### 3. Configurar las variables de entorno (opcional)

**Open-Meteo no requiere una clave** en la integración actual. Para habilitar fotografías de Unsplash, crea una aplicación en [Unsplash Developers](https://unsplash.com/developers) y obtén su **Access Key**.

Si no existe `.env.local`, cópialo desde el archivo de ejemplo:

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env.local
```

**Linux o macOS:**

```bash
cp .env.example .env.local
```

Edita `.env.local` e incorpora tu clave:

```dotenv
UNSPLASH_ACCESS_KEY=tu_access_key
```

**Importante:** no subas `.env.local` a GitHub ni utilices el prefijo `NEXT_PUBLIC_` para esta clave. El archivo está excluido mediante `.gitignore`. Si ya existe, edítalo sin sobrescribir otras configuraciones. Reinicia el servidor después de cambiar las variables de entorno.

Sin la clave de Unsplash, la aplicación puede usar sus paisajes locales de respaldo.

### 4. Iniciar el servidor de desarrollo

**Windows (PowerShell):**

```powershell
pnpm.cmd dev
```

**Linux o macOS:**

```bash
pnpm dev
```

Abre **http://localhost:3000** en el navegador.

Las secciones de SkyCast son **Inicio, Buscar, Pronóstico, Favoritos, Comparar y Acerca de**.

## Comandos de validación

Desde la raíz del proyecto, en Windows:

```powershell
pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd encoding:check
pnpm.cmd exec tsc --noEmit
pnpm.cmd test
```

Para aplicar el formato automáticamente:

```powershell
pnpm.cmd format
```

En Linux o macOS, utiliza `pnpm` en lugar de `pnpm.cmd`.

Las pruebas automatizadas de integraciones externas utilizan respuestas simuladas cuando corresponde. **Superarlas no sustituye una revisión funcional y visual en el navegador.**

## Estructura del proyecto

```text
src/
  app/             Páginas y Route Handlers de Next.js
  components/      Componentes de interfaz y escenas meteorológicas
  hooks/           Hooks compartidos
  lib/             Servicios, tipos y lógica de negocio
public/
  weather/         Paisajes locales en formato WebP
tests/             Pruebas automatizadas
docs/              Documentación, recursos e informes de QA
README.md          Guía de instalación y uso
VIBE_CODING.md     Bitácora resumida de desarrollo
AGENTS.md          Convenciones y reglas del proyecto
```

## Fuentes de datos y fotografías

### Open-Meteo

[Open-Meteo](https://open-meteo.com/) proporciona geocodificación, condiciones actuales y pronósticos. SkyCast valida entradas y respuestas, maneja tiempos de espera y distingue los valores que no están disponibles.

Los datos meteorológicos se atribuyen a Open-Meteo conforme a sus [condiciones de uso](https://open-meteo.com/en/terms) y [licencia indicada por el proveedor](https://open-meteo.com/en/license), con referencia a **CC BY 4.0** y a la adaptación de los datos para su presentación. Los datos de geocodificación proceden de GeoNames.

La API gratuita está sujeta a condiciones de uso no comercial y límites de solicitudes. El uso académico no elimina esas condiciones.

### Unsplash

Cuando está configurada, la integración de [Unsplash](https://unsplash.com/) permite mostrar fotografías en **Favoritos** y **Comparar**:

- **Fotografía de ciudad:** se muestra como vista de una ubicación únicamente cuando la información disponible permite verificarla.
- **Paisaje ilustrativo:** fotografía ambiental relacionada con una categoría meteorológica, pero **no** representa necesariamente la ciudad ni el tiempo real en ella.
- **Respaldo local:** imágenes WebP utilizadas cuando Unsplash no está configurado, no responde o no ofrece alternativas adecuadas.

Las fotografías procedentes de Unsplash muestran atribución enlazada al fotógrafo y a Unsplash. Se respetan sus [directrices de la API](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines).

La selección busca variedad y estabilidad, aunque pueden repetirse imágenes cuando no hay suficientes alternativas. El servidor utiliza caché y un control de solicitudes **por proceso**, que no equivale a una limitación global entre varias instancias. Consulta la [documentación de la API](https://unsplash.com/documentation) para comprobar la cuota y el tipo de acceso aplicables a tu aplicación.

Las variantes de paisajes locales se describen en [docs/paisajes-generados.md](docs/paisajes-generados.md).

## Despliegue en Vercel

SkyCast puede desplegarse como aplicación Next.js en [Vercel](https://vercel.com/):

1. Importa el repositorio de GitHub en un proyecto de Vercel.
2. Comprueba que el framework detectado sea **Next.js** y que se utilice **pnpm**.
3. Si deseas fotografías de Unsplash, agrega `UNSPLASH_ACCESS_KEY` en **Project Settings → Environment Variables**, como variable de servidor, para los entornos que correspondan.
4. Realiza el despliegue y verifica las funcionalidades desde la URL resultante.

Los cambios de variables de entorno se aplican a nuevos despliegues; consulta la [documentación de Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables).

**Importante:** el proyecto está orientado a una **demostración académica controlada**, no a tráfico público elevado. Antes de abrirlo a un número indeterminado de usuarios, habría que revisar las cuotas y condiciones de los proveedores, así como implementar mecanismos adecuados de control de consumo entre instancias. Estas instrucciones no constituyen una autorización ni una confirmación de despliegue.

## Limitaciones conocidas

- Los datos meteorológicos dependen de la disponibilidad y los límites de Open-Meteo.
- Los agregados diarios del proveedor pueden no coincidir exactamente con los límites del día local durante transiciones de horario de verano.
- Las fotografías de Unsplash dependen de su disponibilidad, metadatos, condiciones de acceso y cuotas; son imágenes de archivo, no observaciones meteorológicas en vivo.
- Cuando faltan alternativas, algunas ciudades pueden compartir una imagen de respaldo.
- La caché y el limitador de fotografías operan por proceso y no proporcionan una cuota global distribuida.
- Permanecen pendientes algunas verificaciones de accesibilidad y rendimiento en dispositivos y escenarios reales, documentadas en el informe QA.

## Documentación y metodología Vibe Coding

SkyCast se desarrolló mediante **Vibe Coding**, con apoyo de herramientas de inteligencia artificial para implementar, revisar y mejorar el código, manteniendo validaciones y pruebas sobre los resultados.

- [Bitácora de desarrollo](VIBE_CODING.md): iteraciones, objetivos, decisiones y resultados.
- [Historial de prompts originales](docs/historial-prompts-originales.md): registros conservados de etapas anteriores.
- [Informe de QA final](docs/qa-final.md): hallazgos, pruebas, riesgos y verificaciones pendientes.
- [Paisajes generados](docs/paisajes-generados.md): recursos visuales locales.

**Estado del proyecto:** apto con observaciones para una demostración académica controlada, según la última auditoría documentada. No se presenta como un servicio meteorológico comercial ni como una plataforma validada para tráfico público masivo.

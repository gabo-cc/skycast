# Bitácora de Vibe Coding

Esta bitácora resume las iteraciones significativas de SkyCast. Los apartados «Solicitud» son **síntesis editoriales**, no citas literales. Los prompts y anotaciones disponibles antes de esta reorganización se conservaron íntegros en el [archivo histórico](docs/historial-prompts-originales.md); el prompt de diagnóstico de codificación ya estaba truncado y no se ha reconstruido. Las solicitudes recientes que el usuario pidió no registrar en esta bitácora se documentan únicamente mediante la descripción de las mejoras y su evidencia técnica.

Las cifras históricas corresponden al momento de cada iteración, no a la cobertura actual. Una prueba simulada, una consulta externa y una comprobación visual son evidencias diferentes; cuando una revisión no se realizó, se indica expresamente.

## 1. Calidad inicial y prevención de errores de codificación

- **Objetivo y solicitud:** establecer estándares de mantenimiento y resolver la corrupción de caracteres españoles.
- **Desarrollo y decisiones:** se configuraron Prettier, TypeScript estricto y verificación de UTF-8 y patrones sospechosos. Se optó por escritura explícita UTF-8 y pnpm.
- **Problemas y soluciones:** una canalización de PowerShell con salida ASCII había sustituido caracteres antes de escribir el archivo; se restauró el texto disponible. El detector conserva excepciones limitadas para los ejemplos históricos deliberadamente dañados.
- **Archivos principales:** `AGENTS.md`, `scripts/check-encoding.mjs`, `package.json`, configuración de formato y editor.
- **Pruebas y estado:** el registro anterior documenta pruebas positivas y negativas del detector y comprobaciones de formato, ESLint, build y codificación satisfactorias. El detector no reconoce necesariamente todas las corrupciones posibles.

## 2. Interfaz inicial y correcciones responsive

- **Objetivo y solicitud:** crear las seis rutas de SkyCast y corregir su navegación, iconos y distribución en distintas pantallas.
- **Desarrollo y decisiones:** se construyeron vistas responsive, navegación compartida y componentes reutilizables; los datos de demostración se identificaron como tales. Se ajustaron tamaños de iconos y el menú móvil sin añadir dependencias.
- **Problemas y soluciones:** se detectaron tamaños de icono sin respaldo y espacios que competían en móvil. Se aplicaron dimensiones y disposiciones flexibles; no se confirmó que Tailwind fuera la causa de todos los síntomas iniciales.
- **Archivos principales:** `src/app/globals.css`, páginas de `src/app/`, `src/components/icon.tsx`, `site-header.tsx` y `ui.tsx`.
- **Pruebas y estado:** formato, ESLint, build y codificación pasaron en esa etapa. La automatización de Edge no llegó a funcionar entonces, por lo que la revisión visual histórica quedó pendiente.

## 3. Integración de Open-Meteo y búsqueda de ciudades

- **Objetivo y solicitud:** incorporar geocodificación, pronóstico y búsqueda interactiva con estados accesibles.
- **Desarrollo y decisiones:** se crearon rutas internas y módulos de tipos, validación, transformación y errores. La búsqueda usa espera de 350 ms, cancelación y descarte de respuestas anteriores; las respuestas ausentes no se convierten en datos inventados.
- **Problemas y soluciones:** el primer acceso real falló por restricciones de red; posteriormente se autorizó una consulta. Se emplearon dominios fijos y tiempo límite para el proveedor.
- **Archivos principales:** `src/app/api/ciudades/route.ts`, `src/app/api/clima/route.ts`, `src/lib/open-meteo/`, `src/components/city-search.tsx`, `tests/open-meteo.test.mjs` y `tests/city-search.test.mjs`.
- **Pruebas y estado:** pasaron 6 pruebas en la integración inicial y 11 tras la búsqueda. La consulta real registrada devolvió 10 resultados de geocodificación, 168 horas y siete días; la interacción de búsqueda en navegador no se comprobó en esa etapa.

## 4. Clima real, pronóstico y zonas horarias

- **Objetivo y solicitud:** mostrar condiciones y pronósticos reales respetando la identidad de la ciudad y su hora local.
- **Desarrollo y decisiones:** se transmiten coordenadas e identidad al pronóstico; los datos horarios usan instantes UTC y se muestran con la zona IANA. Las horas repetidas incluyen su desplazamiento.
- **Problemas y soluciones:** los ISO locales con desplazamiento fijo podían confundir horas durante cambios de horario; se adoptaron marcas Unix y formato por zona. La agregación diaria del proveedor aún puede abarcar horas distintas del día local durante una transición.
- **Archivos principales:** `src/lib/open-meteo/`, `src/lib/weather-display.ts`, `src/lib/forecast-location.ts`, `src/app/pronostico/` y pruebas de Open-Meteo y presentación.
- **Pruebas y estado:** pasaron 15 pruebas al integrar clima real y 17 tras la corrección horaria, con casos de Nueva York y otras zonas. Se documentó una consulta real a Nueva York; no hubo comprobación visual en esa etapa.

## 5. Favoritos y comparación funcional

- **Objetivo y solicitud:** guardar ciudades y comparar dos ubicaciones sin perder identidad ni manejar datos ausentes como cero.
- **Desarrollo y decisiones:** favoritos usa almacenamiento local versionado y validado. Comparar reutiliza búsqueda y favoritos, evita seleccionar dos veces la misma ciudad, permite intercambiar y gestiona solicitudes y reintentos por separado.
- **Problemas y soluciones:** para evitar sobrescribir datos dañados se bloquea la escritura cuando falla la lectura; las respuestas incompletas se validan y las métricas ausentes se presentan como no disponibles.
- **Archivos principales:** `src/lib/favorites-storage.ts`, `src/hooks/use-favorites.ts`, `src/components/favorite-cities.tsx`, `comparison.tsx`, `comparison-selector.tsx` y sus pruebas.
- **Pruebas y estado:** se registraron 22 pruebas al incorporar favoritos y 27 al añadir Comparar. En ese momento no se probaron eventos reales en navegador ni sincronización efectiva entre pestañas.

## 6. Auditoría y rediseño de la interfaz

- **Objetivo y solicitud:** revisar los flujos críticos y actualizar la identidad visual, los temas y los ambientes meteorológicos.
- **Desarrollo y decisiones:** se validaron respuestas, se corrigieron el cierre del menú y el orden de datos diarios, y se desarrollaron temas claro, oscuro y automático, paisajes y efectos con preferencias de movimiento reducido.
- **Problemas y soluciones:** la primera comparación visual interpretó una captura de implementación como referencia; una aclaración posterior corrigió la dirección visual. El intento de automatizar Edge falló por permisos de perfil en la auditoría inicial.
- **Archivos principales:** `src/app/globals.css`, componentes de navegación y clima, `src/lib/weather-atmosphere.ts`, `src/lib/theme.ts` y pruebas de flujos y preferencias.
- **Pruebas y estado:** se registraron 30 pruebas en la auditoría, 32 en el rediseño y 34 después de los ajustes atmosféricos. Las comprobaciones visuales y de interacción indicadas como pendientes en esas entradas no deben darse por realizadas en aquel momento.

## 7. Inicio cinematográfico y ciudad principal

- **Objetivo y solicitud:** presentar el clima actual en una escena cinematográfica, permitir explorar horas y personalizar la ciudad principal.
- **Desarrollo y decisiones:** la escena reutiliza el clima disponible y presenta una banda horaria seleccionable; «Ahora» restablece el valor actual. La ciudad principal se conserva en almacenamiento local y se cancelan consultas sustituidas.
- **Problemas y soluciones:** la tarjeta antigua seguía renderizándose porque la nueva escena no estaba conectada. Se integró en el panel de Inicio y se distinguen las métricas actuales de las horas seleccionadas, sin inventar datos horarios.
- **Archivos principales:** `src/components/home-dashboard.tsx`, `home-sky-experience.tsx`, `src/lib/home-weather.ts`, `src/app/api/clima-inicio/route.ts` y `tests/home-weather.test.mjs`.
- **Pruebas y estado:** la entrada histórica del Inicio cinematográfico registra 37 pruebas aprobadas y las validaciones técnicas. En aquella revisión Edge mostró un error del proveedor y se usó una respuesta simulada para capturas; no se verificaron entonces las interacciones ni el ancho móvil real.

## 8. Pronóstico horario interactivo y efectos compartidos

- **Objetivo y solicitud:** hacer explorable el pronóstico por hora y mantener efectos atmosféricos acordes con los datos reales, sin perder accesibilidad.
- **Desarrollo y decisiones:** se desarrollaron selector horario y visualizaciones del pronóstico, con escenas compartidas para nubes, lluvia, sol y estrellas. Los componentes respetan datos ausentes, tema y movimiento reducido.
- **Problemas y soluciones:** las horas repetidas y los cambios de fecha se identifican mediante la zona y el desplazamiento; las capas de efecto se determinan por condición en lugar de inferir datos faltantes.
- **Archivos principales:** `src/components/forecast-interactive.tsx`, `forecast-sky-scene.tsx`, `atmospheric-effects.tsx`, `src/lib/forecast-chart.ts` y sus pruebas.
- **Pruebas y estado:** las pruebas actuales cubren gráficos, clasificación de ambiente y preferencias; la ejecución previa a esta reorganización confirmó 62 pruebas aprobadas. Se mantiene la limitación diaria de horario de verano descrita en la iteración 4.

## 9. Tarjetas meteorológicas de Favoritos y Comparar

- **Objetivo y solicitud:** convertir ambas secciones en experiencias meteorológicas visuales conservando búsqueda, selección, navegación y errores.
- **Desarrollo y decisiones:** las tarjetas incluyen escenario, temperatura y condición; en Favoritos la superficie enlaza al pronóstico mediante `forecastUrl` y el corazón actúa de forma independiente. Comparar presenta diferencias y conserva intercambio y reintento.
- **Problemas y soluciones:** cada ciudad mantiene su propio estado. La cola de Favoritos limita la concurrencia y reutiliza resultados durante cinco minutos; los enlaces y controles no se anidan.
- **Archivos principales:** `src/components/favorite-cities.tsx`, `comparison.tsx`, `src/lib/favorite-weather.ts`, `src/lib/comparison.ts` y `tests/favorite-weather.test.mjs`.
- **Pruebas y estado:** la suite actual incluye navegación con la identidad de cada ciudad, cola, fallos y reintentos. En la revisión de navegador previa se comprobaron la navegación por teclado y el corazón independiente.

## 10. Fotografías, paisajes alternativos y atribución

- **Objetivo y solicitud:** combinar vistas reales verificadas con paisajes meteorológicos variados, evitando duplicados cuando existan alternativas.
- **Desarrollo y decisiones:** Unsplash se consulta solo desde el servidor. Se valida la ubicación de las vistas de ciudad; los resultados ambientales se buscan en inglés por condición y se etiquetan como ilustrativos. La selección coordinada es determinista con las mismas ciudades y candidatos, y conserva los recursos locales WebP como respaldo.
- **Problemas y soluciones:** el sistema anterior elegía independientemente entre dos variantes locales por condición y no buscaba fotografías ambientales. Se añadieron candidatas compartidas, asignación sin duplicados cuando sea posible, caché y atribución al fotógrafo y a Unsplash. La validación conservadora puede descartar nombres traducidos; con pocas alternativas locales las repeticiones son inevitables.
- **Archivos principales:** `src/lib/city-photo.ts`, `unsplash-server.ts`, `weather-landscapes.ts`, `src/app/api/foto-ciudad/`, `src/app/api/fotos-ambiente/`, `src/components/city-photo.tsx`, `scene-photos.tsx`, `public/weather/` y `docs/paisajes-generados.md`.
- **Pruebas y estado:** pruebas de validación, fallo, caché y asignación pasan en la suite actual. Una revisión anterior con Unsplash y Open-Meteo reales mostró cinco imágenes distintas para San Salvador, Santa Tecla, Santa Rosa Guachipilín, Los Ángeles y Ciudad de México; sin servicio se comprobaron los respaldos locales. Los límites en memoria son por proceso, no globales.

## 11. Ajuste responsive de Comparar

- **Objetivo y solicitud:** reducir la altura y equilibrar las dos tarjetas sin cambiar datos, búsqueda de imágenes ni funciones de Favoritos.
- **Desarrollo y decisiones:** se compactaron portadas, métricas y resumen; las tarjetas se estiran a la misma altura y el crédito permanece en el flujo de la portada.
- **Problemas y soluciones:** los nombres y créditos largos provocaban alturas distintas en móvil. La cuadrícula iguala las filas y permite que el contenido aumente la altura sin recortarse.
- **Archivos principales:** `src/components/comparison.tsx` y `src/app/globals.css`.
- **Pruebas y estado:** la revisión anterior usó navegador en 320, 768 y 1365 píxeles, con temas claro y oscuro, créditos largos y movimiento reducido; no se observaron desbordamientos ni superposición con la hora. Pasaron las 62 pruebas y las validaciones de proyecto indicadas en esa revisión.

## 12. Reorganización de documentación y preparación de commits

- **Objetivo y solicitud:** resumir la bitácora por iteraciones, conservar los originales disponibles y preparar una división de cambios revisable sin crear commits.
- **Desarrollo y decisiones:** la bitácora anterior se copió íntegra al archivo histórico, diferenciando sus prompts de las anotaciones. Se actualizó la política de `AGENTS.md` y se corrigió el README para reflejar los paisajes ambientales y la asignación coordinada.
- **Problemas y soluciones:** el historial contiene ejemplos deliberados de texto corrupto necesarios para explicar un error real; el verificador los admite únicamente como líneas exactas en los archivos históricos previstos. Los componentes y el CSS comparten dependencias, por lo que el plan agrupa los cambios que no conviene separar artificialmente.
- **Archivos principales:** `VIBE_CODING.md`, `docs/historial-prompts-originales.md`, `AGENTS.md`, `README.md` y `scripts/check-encoding.mjs`.
- **Pruebas y estado:** la copia del contenido anterior se verificó byte por byte y el Markdown se analizó con 12 encabezados de iteración, 12 listas y el enlace histórico válido. Pasaron `pnpm.cmd format`, `pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build`, `pnpm.cmd encoding:check`, `pnpm.cmd exec tsc --noEmit` y `pnpm.cmd test` (62 pruebas). No se han creado commits ni se ha hecho push o despliegue.

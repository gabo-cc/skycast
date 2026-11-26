# Auditoría QA final de SkyCast 2.0

## Objetivo, alcance y entorno

Revisar la versión existente sin rediseñarla, corregir defectos demostrables y dejar constancia de lo comprobado y de sus límites. La auditoría local se realizó el 26 de noviembre de 2026 sobre Windows, Node.js 22.14.0, pnpm 12.9.1, Next.js 16.4.6 y Edge automatizado. El árbol estaba limpio al inicio y se conservaron los tres commits locales previos.

Los estados siguientes significan: **aprobado**, comprobado en las condiciones indicadas; **fallido**, el comportamiento no cumplió el caso; **pendiente**, requiere una comprobación adicional; y **no ejecutado**, no se realizó. Las respuestas simuladas no prueban la disponibilidad real de un proveedor.

## Casos y resultados

| Área       | Caso                                                                     | Estado y evidencia                                                                                                                                                                                                                                                      |
| ---------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inicio     | Consulta real de Open-Meteo                                              | **Aprobado**: `/api/clima` devolvió HTTP 200 y datos actuales para San Salvador desde el servidor local con red autorizada.                                                                                                                                             |
| Inicio     | Ciudad principal, persistencia, restablecimiento y búsqueda con espacios | **Aprobado** en Edge con ciudades y clima simulados; la preferencia persistió tras recargar y pudo restablecerse. Añadir espacios a «Madrid» durante y después de la búsqueda conservó resultados y una sola consulta.                                                  |
| Inicio     | Hora seleccionada y «Ahora»                                              | **Aprobado** en Edge con datos simulados: cambió el estado `aria-pressed` al seleccionar una hora y al volver a «Ahora».                                                                                                                                                |
| Buscar     | Términos, cancelación, homónimos, resultados y errores                   | **Aprobado** mediante pruebas automatizadas con respuestas simuladas. La página se abrió en el barrido de anchuras; no se completó un recorrido de búsqueda real en navegador.                                                                                          |
| Pronóstico | Hora, gráfica y vista diaria                                             | **Aprobado** en Edge con clima simulado: se mostraron 24 puntos, cambió la lectura al seleccionar otro punto y se seleccionó un día entre siete.                                                                                                                        |
| Pronóstico | Zonas IANA, horas repetidas y datos ausentes                             | **Aprobado** en pruebas automatizadas. La limitación de agregación diaria durante cambios de horario sigue vigente.                                                                                                                                                     |
| Favoritos  | Identidad del enlace y corazón                                           | **Aprobado** con favoritos y clima simulados: el corazón eliminó una tarjeta sin navegar; otra tarjeta recibió foco y Enter abrió el pronóstico con ID, nombre, país y coordenadas correctos.                                                                           |
| Favoritos  | Persistencia y eventos entre pestañas                                    | **Aprobado** en dos pestañas reales de Edge con clima simulado: al eliminar una ciudad en la primera, la segunda actualizó su lista. Las pruebas automatizadas cubren además almacenamiento versionado y selección de eventos.                                          |
| Comparar   | Selección, búsqueda con espacios e intercambio                           | **Aprobado** en Edge con ciudades y clima simulados: una sola consulta para términos equivalentes y cambio de orden Madrid/París al intercambiar.                                                                                                                       |
| Comparar   | Métricas, valores ausentes y solicitudes independientes                  | **Aprobado** en pruebas automatizadas con proveedor simulado. La comparación se mostró con dos ciudades simuladas en navegador.                                                                                                                                         |
| Fotos      | Vista verificada y paisajes ambientales                                  | **Aprobado** para las consultas reales de esta sesión: San Salvador devolvió una foto verificada y `/api/fotos-ambiente`, con la categoría `sunny`, devolvió 30 candidatas. Las respuestas examinadas no contenían la clave configurada.                                |
| Fotos      | Créditos, portada y fallo de imagen                                      | **Aprobado** en Edge con foto real de Unsplash y clima simulado: portada `cover`, crédito visible y alcanzable, y respaldo local al bloquear la imagen. Las pruebas automatizadas comprueban enlaces con atribución y selección sin duplicados cuando hay alternativas. |
| Acerca de  | Contenido y enlaces internos                                             | **Aprobado** para apertura y revisión de contenido en el barrido. No se activaron individualmente todos sus enlaces.                                                                                                                                                    |

## Responsive, temas y accesibilidad

- **Aprobado con alcance acotado:** se midió el desbordamiento horizontal en las seis rutas a 320, 375, 430, 768, 1024, 1440 y 1920 píxeles: no se detectó desbordamiento. Buscar y Acerca de se abrieron sin simulación; Favoritos y Comparar usaron ciudades y clima simulados; Inicio y Pronóstico se revisaron primero en error por red restringida y después con Open-Meteo simulado en servidor.
- **Aprobado con alcance acotado:** se inspeccionaron capturas móviles de Inicio, Pronóstico, Favoritos y Comparar y una de escritorio de Comparar; no se inspeccionó visualmente cada una de las 42 combinaciones. Comparar conservó la misma altura de tarjetas y el apilado móvil.
- **Aprobado con alcance acotado:** se verificaron los temas claro, oscuro y automático en Acerca de. La consulta de movimiento reducido respondió correctamente; no se inspeccionó cada animación por separado.
- **Aprobado con alcance acotado:** el enlace de una tarjeta de Favoritos recibió foco y Enter abrió el pronóstico correspondiente. Las imágenes de portada de Unsplash están marcadas como decorativas en el código revisado.
- **Pendiente:** medición sistemática de contraste y recorrido completo con lector de pantalla, teclado y dispositivo táctil real.
- **Aprobado con alcance acotado:** no se registraron excepciones ni errores de consola en las dos pestañas durante la sincronización y navegación de Favoritos, con clima simulado. El primer simulador de red produjo un error propio con una URL de Next.js; se corrigió el simulador y se repitió el caso. **Pendiente:** inspección de consola durante todos los demás flujos.

## Defectos identificados y correcciones

| Severidad | Hallazgo                                                                                                                                                                         | Corrección y evidencia                                                                                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Media     | En los buscadores de Inicio y Comparar, agregar o quitar espacios exteriores invalidaba una consulta cuyo término efectivo no había cambiado y podía dejar la interfaz cargando. | **Aprobado** después de corregir ambos manejadores. Dos pruebas de regresión simulan el ciclo de eventos, respuestas pendientes y resultados existentes; Edge confirmó ambos casos con proveedor simulado. |
| Baja      | `/api/clima-inicio` devolvía 502 para todos los fallos, incluso cuando el proveedor estaba inaccesible o agotaba el tiempo de espera.                                            | **Aprobado** con prueba simulada: conserva el mensaje genérico, devuelve 503 y 504 cuando corresponde, y mantiene 502 para otros errores y 400 para coordenadas inválidas.                                 |

La limpieza se limitó a retirar el uso innecesario de `NextResponse` en esa ruta y reutilizar el tipo de error existente. No se eliminaron componentes, paisajes, animaciones ni dependencias: una búsqueda textual por sí sola no demuestra que un recurso público sea seguro de borrar.

## APIs, seguridad y rendimiento

- **Aprobado con alcance acotado:** se revisaron validación de entrada, JSON inválido, errores HTTP, tiempos de espera, cancelación y datos ausentes mediante código y pruebas con mocks. Open-Meteo usa un límite de espera de ocho segundos; Unsplash, seis.
- **Aprobado con alcance acotado:** `.env.local` está ignorado; la clave de Unsplash se lee en Route Handlers. No apareció la clave configurada en 91 archivos de texto candidatos, en 21 archivos estáticos de cliente inspeccionados ni en las tres respuestas reales examinadas. Esta búsqueda no garantiza la ausencia de cualquier otro secreto.
- **Aprobado:** `pnpm.cmd audit --json` informó cero avisos conocidos para las dependencias examinadas en esta fecha. El resultado depende de los avisos disponibles al consultar.
- **Aprobado por revisión de código y pruebas:** las consultas de Favoritos y fotos usan caché y límites de concurrencia; las búsquedas ambientales se comparten por condición y no requieren coincidencia geográfica. Los enlaces de Unsplash conservan sus parámetros de atribución.
- **Pendiente:** prueba de carga, medición de rendimiento en un dispositivo móvil y evaluación de límites globales. El límite de 40 llamadas por hora de Unsplash es por proceso; varias instancias o solicitudes anónimas pueden agotar la cuota compartida.
- **Información:** los WebP de `public/weather` suman 1.948.598 bytes; el mayor ocupa 208.170 bytes. Se observaron reglas de movimiento reducido, pero no se midió el costo de cada animación.

## Validaciones finales

- **Aprobado:** `pnpm.cmd format`, `pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build`, `pnpm.cmd encoding:check`, `pnpm.cmd exec tsc --noEmit` y `pnpm.cmd test`; la suite terminó con **65 pruebas aprobadas**.
- **Aprobado:** `git diff --check` no informó errores de espacios. `git status` mostró los cambios de esta auditoría; los tres commits anteriores y el historial original se conservaron.
- **Aprobado con alcance acotado:** la revisión de secretos descrita arriba no encontró la clave configurada en los archivos candidatos. No se detectaron archivos temporales nuevos en el árbol de trabajo; los perfiles, scripts y capturas de navegador se usaron fuera del repositorio.

## Riesgos y recomendación

- Los agregados diarios de Open-Meteo pueden abarcar horas distintas del día local durante una transición de horario. Su [API gratuita](https://open-meteo.com/en/terms) es para uso no comercial y puede aplicar límites; hay que confirmar las condiciones para el uso previsto.
- Las vistas verificadas pueden faltar por metadatos incompletos o nombres traducidos; con pocas candidatas algunas tarjetas pueden repetir el respaldo. Una imagen ambiental fallida provoca el uso del paisaje local de esa tarjeta.
- Antes de una publicación abierta deben revisarse la cuota y la aprobación de producción de [Unsplash](https://unsplash.com/documentation), los límites distribuidos y las comprobaciones pendientes de accesibilidad y carga.

**Recomendación: APTO CON OBSERVACIONES para una demostración académica controlada.** La publicación abierta todavía no se recomienda hasta revisar los riesgos de cuota y completar las comprobaciones pendientes. Esta auditoría no autoriza ningún despliegue.

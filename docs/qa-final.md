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

## Continuación: verificación previa a publicación abierta

Esta revisión del 26 de noviembre de 2026 se centra en los pendientes anteriores. No implica un despliegue ni sustituye las comprobaciones realizadas en la auditoría inicial.

### Accesibilidad

- Con Edge, axe-core 4.14.1 y una anchura de 375 píxeles se examinaron las seis rutas en temas claro y oscuro. Inicio y Pronóstico usaron respuestas meteorológicas simuladas en el servidor; Favoritos y Comparar, clima y fotos simulados en el navegador. No se detectó desbordamiento horizontal en esas vistas.
- Se detectaron dos problemas automáticos: el nombre accesible de los botones horarios de Inicio no contenía la etiqueta visible y una etiqueta horaria de Pronóstico en tema oscuro tenía contraste de 1,81:1 frente al mínimo de 4,5:1. Se corrigieron el nombre y la separación textual de los botones, y el color de la hora seleccionada. La relación calculada para esta última es 8,01:1 en claro y 10,33:1 en oscuro; dos pruebas renderizadas cubren ambos casos. Una segunda revisión de Inicio y Pronóstico con axe, en ambos temas y 375 píxeles, no encontró infracciones automáticas.
- En el barrido no se señalaron infracciones automáticas en Buscar, Favoritos, Comparar ni Acerca de; Pronóstico claro tampoco presentó infracciones. Hasta 35 elementos por vista quedaron con contraste indeterminado por fondos o composiciones, por lo que no se acredita el cumplimiento integral de WCAG 2.2 AA.
- En Edge con datos simulados, Tab y Enter abrieron el pronóstico desde una tarjeta; Tab y Espacio eliminaron otra con el corazón sin navegar. También se seleccionaron con teclado un punto horario del pronóstico y una opción favorita de Comparar. Este recorrido no cubre todos los controles ni el orden completo del foco.
- Con emulación de movimiento reducido, `matchMedia` devolvió la preferencia activa y la regla global limita la duración de las animaciones a 0,01 ms. No se verificó individualmente cada animación. Permanecen pendientes una revisión completa del orden de foco y teclado, contraste manual sobre fotografías, lector de pantalla y dispositivo táctil físico.

### Rendimiento y carga controlada

- Una prueba local de 60 ciudades de Favoritos, con 15 ms de latencia artificial por respuesta meteorológica, terminó en 910 ms, con máximo de tres solicitudes simultáneas; la mediana fue 605 ms y el percentil 95, 868 ms. Una segunda ronda desde caché tardó 1 ms y no hizo consultas. Son medidas del simulador, no latencia de Open-Meteo ni garantía de rendimiento en producción.
- En un proceso local, 50 búsquedas diferentes de Unsplash con 20 ms de latencia artificial terminaron en 804 ms: se efectuaron 40 consultas simuladas, con máximo de dos simultáneas. Repetir una ciudad ya consultada no produjo otra llamada. Una prueba separada con 50 solicitudes concurrentes para una misma ciudad produjo una sola consulta simulada. No se aplicó carga a las APIs públicas.
- Diez solicitudes meteorológicas simultáneas para la misma coordenada produjeron tres consultas en vuelo antes de que hubiera un resultado en caché; la cola limita la concurrencia, pero no deduplica esas peticiones en curso.
- Los 21 WebP locales ocupan 1.948.598 bytes en total; el mayor ocupa 208.170 bytes. Las fotografías externas se cargan de forma diferida y se sirven directamente desde Unsplash. No se midieron memoria ni rendimiento de animación en un dispositivo móvil físico.
- La asignación coordinada de paisajes se calculaba de nuevo por cada tarjeta y ordenaba candidatos repetidamente durante el emparejamiento. Se comparte ahora un cálculo por actualización y se preparan sus listas una sola vez. En un ensayo aislado de Node con 60 tarjetas y 32 opciones, una asignación pasó de 2.880,90 ms y 4.080.632 bytes de aumento temporal de heap antes de la recolección a 63,96 ms y 772.456 bytes; no son mediciones de memoria sostenida ni tiempos de carga en navegador. Se comparó la selección anterior y la nueva en 18 conjuntos, y se añadió una prueba de estabilidad y diversidad.
- La caché de fotos en el servidor conserva éxitos durante 24 horas y resultados vacíos durante cinco minutos; las búsquedas iguales en curso se deduplican. Los límites y cachés en memoria no son globales ni sobreviven a reinicios.

### Condiciones de proveedores

- [Open-Meteo](https://open-meteo.com/en/terms) limita la API gratuita no comercial a menos de 600 solicitudes por minuto, 5.000 por hora y 10.000 por día; aplica límites por dirección IP y aplicación y advierte de restricciones anticipadas en proveedores de nube. El uso comercial requiere revisar sus [planes](https://open-meteo.com/en/pricing). La [licencia](https://open-meteo.com/en/license) exige atribución y enlace a CC BY 4.0; se añadió atribución enlazada y una indicación de adaptación de los datos. La geocodificación identifica a [GeoNames](https://open-meteo.com/en/docs/geocoding-api) como fuente.
- [Unsplash](https://unsplash.com/documentation) permite 50 solicitudes API por hora en modo de demostración. Su [ayuda](https://help.unsplash.com/en/articles/3887917-when-should-i-apply-for-a-higher-rate-limit) indica solicitar acceso de producción para aplicaciones públicas. La documentación menciona 1.000 por hora para producción, mientras la [ayuda oficial en español](https://help.unsplash.com/es/articles/3887917-cuando-debo-solicitar-un-limite-de-frecuencia-mas-alto) menciona 5.000: se debe confirmar la cuota efectiva asignada, no asumir ninguna de las dos cifras.
- Las [directrices de Unsplash](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines) requieren usar las URL de imagen devueltas por la API, atribuir al fotógrafo y a Unsplash con enlaces y parámetros de referencia, y mantener las claves confidenciales. También requieren registrar el evento de descarga cuando la aplicación permite una acción equivalente a seleccionar o descargar una imagen; la presentación automática no demuestra por sí sola ese caso. Debe verificarse la aprobación y los términos aplicables a la aplicación concreta.
- Las [funciones de Vercel](https://vercel.com/docs/functions) pueden ejecutarse en varias instancias. El límite de 40 solicitudes por hora y dos concurrentes de SkyCast se aplica por proceso: varios procesos o reinicios pueden superar juntos la cuota de Unsplash. Las rutas públicas de clima y geocodificación tampoco limitan el acceso por origen, de modo que el tráfico anónimo puede consumir la cuota de Open-Meteo. Se necesita una protección efectiva compartida y revisar el tráfico permitido antes de abrir el servicio; no se ha instalado un servicio nuevo ni se ha verificado el comportamiento en Vercel.

### Seguridad

- `.env.local` está ignorado por Git y la clave de Unsplash se utiliza en el servidor. La búsqueda de la clave configurada en 378 objetos Git alcanzables y 22 archivos estáticos de cliente no encontró coincidencias. Esto no prueba la ausencia de otros secretos ni examina objetos inalcanzables.
- Diez pruebas locales de Route Handlers, sin red, rechazaron parámetros inválidos o duplicados y devolvieron respaldos vacíos para solicitudes de foto válidas sin clave. No se encontraron claves en las respuestas examinadas. Las APIs públicas siguen expuestas a consumo de cuota, como se explica arriba.

### Validaciones de esta continuación

- Pasaron `pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build`, `pnpm.cmd encoding:check`, `pnpm.cmd exec tsc --noEmit`, `pnpm.cmd test` y `git diff --check`; la suite contiene **69 pruebas aprobadas**. ESLint señaló inicialmente nombres de variables en las pruebas nuevas; se corrigieron y se repitió la comprobación.
- El archivo `docs/historial-prompts-originales.md` conserva el mismo SHA-256 que al inicio de esta revisión. No se hicieron commits, push ni despliegue.

### Dictamen para publicación abierta

**NO APTO PARA PUBLICAR abiertamente todavía.** Antes de abrir el servicio se deben resolver o aceptar explícitamente los controles de cuota entre instancias y de tráfico anónimo, confirmar la aprobación y cuota de Unsplash y completar las comprobaciones pendientes de accesibilidad. El dictamen anterior para una demostración académica controlada conserva su alcance.

### Alcance confirmado: demostración académica controlada

Se confirma que SkyCast 2.0 se utilizará exclusivamente con fines educativos, sin actividad comercial y con tráfico reducido. Para ese alcance, el dictamen es **APTO CON OBSERVACIONES para una demostración académica controlada**, basado en las comprobaciones y limitaciones registradas arriba. La demostración debe controlar su audiencia y consumo de las API; esta conclusión no autoriza un despliegue ni garantiza disponibilidad frente a tráfico imprevisto.

La **publicación abierta con tráfico no controlado** sigue sin recomendarse: el límite de Unsplash y las cachés son por proceso, las rutas públicas pueden consumir cuotas sin controles por origen y no se ha verificado el comportamiento con múltiples instancias en Vercel. Los límites, atribuciones, condiciones de uso y la aprobación de Unsplash que corresponda siguen siendo aplicables aunque el proyecto sea académico y no comercial.

Siguen pendientes el recorrido completo mediante teclado y la revisión del orden de foco, el contraste manual sobre fotografías, las pruebas con lector de pantalla y dispositivo táctil físico, y la medición de rendimiento y animaciones en un móvil físico. Las pruebas de carga descritas emplearon respuestas simuladas y no sustituyen una evaluación de carga sostenida ni de varias instancias. No se realizaron verificaciones nuevas de accesibilidad o carga por confirmar este alcance.

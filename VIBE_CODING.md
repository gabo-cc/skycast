# Bitácora de Vibe Coding

Esta bitácora conserva los prompts disponibles y sus resultados reales. En cada nueva sesión se añadirá una entrada consecutiva con el texto original completo, las acciones, los archivos, las decisiones, los problemas, las pruebas y el estado. No se reconstruyen prompts anteriores que no están disponibles.

## 1. Configuración inicial de calidad y mantenimiento

**Objetivo:** establecer estándares de calidad, formato, documentación y mantenimiento antes de implementar funcionalidades.

### Prompt completo

```text
Actúa como ingeniero de software senior especializado en Next.js 16, React 19, TypeScript, Tailwind CSS y Clean Code.

Estamos desarrollando SkyCast, una aplicación meteorológica mediante Vibe Coding.

El proyecto ya está inicializado con Next.js 16.4.6, React 19.3.0, TypeScript y Tailwind CSS 4.3.3.

Utilizamos exclusivamente pnpm 12.9.1.

OBJETIVO:\
Configurar desde el inicio los estándares de calidad, documentación, formato y mantenimiento del proyecto antes de implementar funcionalidades.

REQUISITOS:

1. Configurar Prettier como dependencia de desarrollo.
2. Crear .editorconfig con codificación UTF-8, indentación de dos espacios y finales de línea LF.
3. Configurar Prettier con comillas dobles, punto y coma y ancho de línea de 100 caracteres.
4. Integrar Prettier con Tailwind CSS cuando sea apropiado.
5. Agregar scripts para comprobar y aplicar formato.
6. Crear o actualizar AGENTS.md con reglas permanentes de Clean Code.
7. Crear VIBE_CODING.md para documentar el proceso de desarrollo.
8. Registrar todos los prompts relacionados con el proyecto, conservando su texto original y los resultados reales.
9. Crear .env.example con las variables de configuración necesarias, sin incluir secretos.
10. Revisar la advertencia de Turbopack relacionada con un pnpm-lock.yaml externo al repositorio y corregirla mediante configuración local apropiada, sin modificar archivos externos ni eliminar opciones existentes.

REGLAS DE CÓDIGO:

- Utilizar TypeScript estricto.
- Mantener Server Components por defecto.
- Utilizar Client Components cuando exista una necesidad real de interactividad.
- Nunca generar código comprimido en una sola línea.
- Aplicar Clean Code y separación de responsabilidades.
- Utilizar nombres descriptivos.
- Evitar duplicación y dependencias innecesarias.
- Mantener formato consistente mediante Prettier.
- Utilizar UTF-8 y español correctamente acentuado.
- No alterar las configuraciones existentes sin justificación.

DOCUMENTACIÓN:

VIBE_CODING.md debe registrar cada prompt con:

- Número consecutivo.
- Objetivo.
- Prompt completo.
- Acciones realizadas.
- Archivos modificados.
- Decisiones técnicas.
- Problemas y soluciones.
- Pruebas ejecutadas y resultados reales.
- Estado final.

Registrar también este prompt como parte de la configuración inicial.

AGENTS.md debe incluir estas reglas para futuras sesiones de Codex.

COMMITS:

Utilizar Conventional Commits con el tipo en inglés y la descripción en español.

Ejemplos:

chore: configurar herramientas de desarrollo

feat: implementar búsqueda meteorológica

fix: corregir manejo de errores de la API

docs: actualizar bitácora de Vibe Coding

No realizar commits ni push sin autorización.

VALIDACIONES:

Ejecutar mediante pnpm:

- Comprobación de formato.
- ESLint.
- Build de producción.

Corregir los errores introducidos y documentar los resultados reales.

RESTRICCIONES:

- No implementar todavía las páginas de SkyCast.
- No consumir la API meteorológica.
- No implementar nuevas funcionalidades.
- No modificar archivos fuera del proyecto.
- No realizar commits automáticamente.

Al finalizar, proporciona un resumen de los archivos creados o modificados y los resultados de las verificaciones.
```

### Acciones realizadas

Se configuraron Prettier, su complemento de Tailwind CSS y EditorConfig; se documentaron los estándares y se fijó la raíz de Turbopack en el proyecto.

### Archivos modificados

`.editorconfig`, `.prettierrc.json`, `.prettierignore`, `.env.example`, `.gitignore`, `AGENTS.md`, `VIBE_CODING.md`, `next.config.ts`, `package.json` y `pnpm-lock.yaml`. El formateo también actualizó `src/app/layout.tsx` y `src/app/page.tsx`.

### Decisiones técnicas

TypeScript ya tenía `strict: true`. Se mantienen las opciones existentes de Turbopack. No hay variables de entorno necesarias todavía. El lockfile se excluye del formateo para que pnpm lo gestione.

### Problemas y soluciones

PowerShell bloqueó `pnpm.ps1`, por lo que se usó `pnpm.cmd`. La descarga inicial falló por restricciones de red y se completó con acceso autorizado. Git detectó otra propiedad del directorio; la consulta de estado se realizó con una excepción temporal, sin cambiar la configuración global.

### Pruebas ejecutadas y resultados reales

- `pnpm.cmd format:check`: correcto, todos los archivos incluidos cumplen el formato.
- `pnpm.cmd lint`: correcto, sin errores.
- `pnpm.cmd build`: correcto; compilación, TypeScript y generación estática completados. No apareció la advertencia sobre la raíz de Turbopack.

### Estado final

Completado. No se implementaron funcionalidades meteorológicas ni se realizaron commits o push.

## 2. Diagnóstico y prevención de corrupción de caracteres

**Objetivo:** corregir la corrupción de caracteres y prevenir su repetición con comprobaciones verificables.

### Prompt completo

```text
Actúa como ingeniero de software senior especializado en Windows, PowerShell, VS Code, Node.js, Next.js y codificación de caracteres.

PROBLEMA CRÍTICO:

El archivo VIBE_CODING.md de SkyCast volvió a generarse con caracteres españoles dañados.

Ejemplos reales:

- "Bit?cora" en lugar de "Bitácora".
- "Configuraci?n" en lugar de "Configuración".
- "est?ndares" en lugar de "estándares".
- "c?digo" en lugar de "código".
- "espa?ol" en lugar de "español".

Este problema ya ocurrió anteriormente en otro proyecto y necesitamos identificar su causa para evitar que vuelva a repetirse.

OBJETIVO:

Diagnosticar y corregir los problemas de codificación de caracteres en todo SkyCast, establecer mecanismos preventivos y comprobar que funcionan realmente.

## 1. Diagnóstico

Antes de modificar archivos:

1. Inspecciona la codificación real de VIBE_CODING.md y AGENTS.md.
2. Determina si existen caracteres de reemplazo Unicode o signos de interrogación ASCII que sustituyeron caracteres españoles.
3. Comprueba la configuración UTF-8 de VS Code y EditorConfig.
4. Revisa si algún comando, script de PowerShell o mecanismo de escritura está provocando pérdida de caracteres.
5. Comprueba si el problema afecta otros archivos del proyecto.
6. Identifica la causa únicamente si existe evidencia verificable.

IMPORTANTE:

Un archivo puede ser UTF-8 válido y contener caracteres dañados como "Bit?cora". Por lo tanto, verificar únicamente que se decodifica como UTF-8 no es suficiente.

## 2. Corrección

Corrige los caracteres dañados en todos los archivos afectados.

Requisitos:

- Mantener los textos correctamente escritos en español.
- Conservar tildes, ñ, ¿ y ¡.
- No eliminar tildes como solución.
- No modificar el significado de la documentación.
- Conservar el texto original completo de los prompts.
- No eliminar información ni registros anteriores.
- No modificar funcionalidades de la aplicación.

## 3. Prevención

Establece mecanismos para evitar que los caracteres vuelvan a dañarse.

Requisitos:

1. Confirmar que .editorconfig utilice charset = utf-8.
2. Configurar UTF-8 para los archivos del espacio de trabajo en VS Code, cuando corresponda.
3. Revisar los métodos empleados para escribir archivos desde PowerShell.
4. Evitar métodos de escritura que sustituyan caracteres no ASCII.
5. Verificar el contenido real del archivo después de escribirlo.
6. Incorporar a AGENTS.md una instrucción obligatoria de comprobar que no se han dañado caracteres españoles después de cada modificación.
7. No modificar configuraciones globales de Windows o PowerShell sin autorización.

Si identificas una solución preventiva verificable, aplícala únicamente dentro del proyecto.

## 4. Validación automática

Implementa un mecanismo sencillo y mantenible para detectar posibles caracteres dañados en archivos de código y documentación.

Debe detectar patrones sospechosos como:

- Bit?cora
- Configuraci?n
- espa?ol
- c?digo
- Caracteres Unicode de reemplazo.

Evita falsos positivos relacionados con la sintaxis válida de TypeScript y JavaScript.

No consideres que todos los signos de interrogación representan errores.

Agrega un script de verificación al proyecto si resulta apropiado.

## 5. Prueba real de escritura

Realiza una prueba controlada escribiendo y leyendo texto UTF-8 que contenga:

"Bitácora de Vibe Coding. Configuración, código, español, pronóstico, búsqueda, ¿Cómo estás? ¡Excelente!"

Comprueba que el contenido recuperado sea exactamente igual al original.

Utiliza un archivo temporal dentro del proyecto y elimínalo después de la prueba.

Documenta el resultado real.

## 6. Documentación

Registra este prompt completo en VIBE_CODING.md.

Documenta:

- Problema identificado.
- Diagnóstico realizado.
- Causa confirmada o hipótesis pendiente.
- Soluciones aplicadas.
- Archivos modificados.
- Pruebas realizadas.
- Resultados reales.

Verifica que el propio registro de este prompt conserve correctamente todos los caracteres españoles.

## 7. Validaciones finales

Ejecuta:

pnpm.cmd format:check\
pnpm.cmd lint\
pnpm.cmd build

Además, ejecuta la validación de codificación que hayas implementado.

Corrige cualquier error introducido.

## Restricciones

- No implementar funcionalidades nuevas.
- No agregar páginas.
- No integrar Open-Meteo.
- No modificar archivos fuera de SkyCast.
- No cambiar configuraciones globales.
- No realizar commits ni push.
- No afirmar que el problema está solucionado sin pruebas verificables.

Al finalizar, indica qué causaba el problema, si pudo determinarse, qué medidas prevent
```

### Diagnóstico y causa

Antes de corregir, `VIBE_CODING.md` era UTF-8 válido sin BOM ni U+FFFD, pero contenía 68 signos ASCII de sustitución; `AGENTS.md` era UTF-8 válido sin BOM, U+FFFD ni signos de interrogación. EditorConfig ya indicaba UTF-8; no había ajustes locales de VS Code. La entrada anterior se escribió canalizando un here-string de PowerShell hacia Python. En esta sesión `$OutputEncoding` era ASCII y una prueba de esa canalización transformó `áñ¿¡` en `????` antes de que Python escribiera: la pérdida ocurrió antes de la codificación UTF-8 del archivo. La inspección de archivos de texto del proyecto no encontró otros casos fuera de la bitácora.

### Acciones, archivos y decisiones

Se restauró la primera entrada usando el prompt disponible, se añadió esta entrada, se configuró UTF-8 en `.vscode/settings.json` y se añadió `scripts/check-encoding.mjs` con el script `encoding:check` en `package.json`. Se amplió `AGENTS.md` para exigir comprobaciones tras modificar archivos. El detector señala patrones sospechosos y UTF-8 inválido; no puede reconocer todas las sustituciones posibles. Los ejemplos literales de este prompt se conservan como datos originales.

### Pruebas y estado

La escritura y lectura mediante Node.js con UTF-8 explícito devolvió exactamente `Bitácora de Vibe Coding. Configuración, código, español, pronóstico, búsqueda, ¿Cómo estás? ¡Excelente!`; se eliminó el archivo temporal. Una prueba con los cuatro patrones solicitados y U+FFFD detectó las cinco líneas; otra aceptó operadores ternario, encadenamiento opcional y fusión nula de TypeScript. Ambos archivos de prueba se eliminaron. El primer ensayo del detector señaló sus propios ejemplos; se corrigió y la comprobación posterior pasó.

Validaciones finales: `pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build` y `pnpm.cmd encoding:check` terminaron correctamente. La compilación incluyó TypeScript y generación estática. Estado: completado; no se modificaron funcionalidades ni configuraciones globales y no se realizaron commits ni push.

## 3. Iteración 01: diseño responsive y navegación

**Objetivo:** implementar la estructura visual responsive, las seis rutas y la navegación compartida de SkyCast.

### Prompt completo

```text
Actúa como desarrollador senior especializado en Next.js 16, React 19, TypeScript, Tailwind CSS 4 y diseño UI/UX.

Estamos desarrollando SkyCast mediante Vibe Coding.

La Iteración 00 ya está completada y hemos establecido las reglas de calidad, documentación y codificación del proyecto.

Lee y respeta las instrucciones de AGENTS.md antes de modificar archivos.

Utiliza exclusivamente pnpm.

OBJETIVO:\
Implementar la Iteración 01: diseño responsive, estructura de páginas y navegación de SkyCast.

## 1. Rutas

Crear seis rutas utilizando App Router:

- / — Inicio.
- /buscar — Búsqueda de ciudades.
- /pronostico — Pronóstico meteorológico.
- /favoritos — Ciudades favoritas.
- /comparar — Comparación de ciudades.
- /acerca-de — Información del proyecto.

## 2. Diseño

Implementar una interfaz meteorológica moderna, coherente y profesional.

Requisitos:

- Diseño responsive.
- Navegación compartida.
- Interfaz adaptable a móviles, tabletas y escritorio.
- Tarjetas meteorológicas reutilizables.
- Tipografía legible.
- Iconografía consistente.
- Buen contraste.
- Estados de foco visibles.
- HTML semántico.
- Estilos organizados mediante Tailwind CSS.

## 3. Contenido

Inicio:\
Presentación de SkyCast y una tarjeta meteorológica principal.

Buscar:\
Interfaz visual de búsqueda de ciudades y resultados de demostración.

Pronóstico:\
Tarjetas y secciones preparadas para mostrar pronósticos horarios y diarios.

Favoritos:\
Interfaz para mostrar ciudades favoritas y un estado vacío.

Comparar:\
Estructura visual para comparar condiciones de dos ciudades.

Acerca de:\
Información del proyecto, tecnologías y metodología Vibe Coding.

## 4. Arquitectura

- Server Components por defecto.
- Client Components solo cuando exista interactividad real.
- Componentes reutilizables.
- Separación de responsabilidades.
- Datos de demostración separados de la presentación.
- No implementar API ni persistencia todavía.

Los datos demostrativos deben estar identificados claramente y no presentarse como datos meteorológicos actuales.

## 5. Calidad

Cumplir todas las reglas de AGENTS.md.

- Código legible y organizado.
- Prettier.
- TypeScript estricto.
- UTF-8.
- Español correctamente acentuado.
- Sin archivos comprimidos en una sola línea.
- Sin dependencias innecesarias.

## 6. Documentación

Registrar este prompt completo en VIBE_CODING.md.

Documentar:

- Objetivo.
- Acciones realizadas.
- Archivos modificados.
- Decisiones técnicas.
- Problemas y soluciones.
- Pruebas ejecutadas.
- Estado final.

No inventar resultados.

## 7. Validaciones obligatorias

Ejecutar:

pnpm.cmd format:check\
pnpm.cmd lint\
pnpm.cmd build\
pnpm.cmd encoding:check

Corregir cualquier error detectado.

Verificar que las seis rutas estén presentes en el resultado de compilación.

No afirmar que la interfaz fue revisada visualmente si no se verificó en un navegador.

## 8. Restricciones

- No integrar Open-Meteo todavía.
- No implementar funcionalidades fuera de esta iteración.
- No crear commits ni ejecutar push.
- No modificar archivos externos al proyecto.

Al finalizar, proporcionar un resumen de los cambios, componentes utilizados y resultados de las pruebas.

No avanzar a la siguiente iteración.
```

### Acciones y archivos modificados

Se creó la navegación compartida y se implementaron las seis vistas responsive. Se modificaron `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx` y esta bitácora; se crearon los archivos `page.tsx` de `buscar`, `pronostico`, `favoritos`, `comparar` y `acerca-de`, los componentes `icon.tsx`, `site-header.tsx`, `ui.tsx` y los datos `src/lib/demo-weather.ts`.

### Decisiones técnicas

Las páginas y componentes son Server Components; los enlaces utilizan `Link`. Los ejemplos se separaron de la presentación y están señalados como ilustrativos. La búsqueda y la selección de ciudades son representaciones visuales, y el estado vacío explica que los favoritos estarán disponibles más adelante. No se añadieron dependencias, API ni persistencia.

### Problemas y soluciones

La primera aplicación del parche de archivos intentó borrar y crear el mismo archivo en una sola operación, lo que la herramienta rechazó sin aplicar cambios; se dividió en operaciones separadas. Se ejecutó la comprobación de codificación tras las modificaciones.

### Pruebas y estado final

`pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build` y `pnpm.cmd encoding:check` finalizaron correctamente. La compilación confirmó las seis rutas `/`, `/buscar`, `/pronostico`, `/favoritos`, `/comparar` y `/acerca-de` como contenido estático. No se realizó una revisión visual en navegador. Estado: iteración 01 completada; sin commits ni push.

## 4. Corrección visual de la Iteración 01

### Prompt completo

```text
Actúa como ingeniero frontend senior especializado en Next.js 16, React 19, Tailwind CSS 4, diseño responsive, accesibilidad y depuración de interfaces.

PROBLEMA:

La Iteración 01 de SkyCast compila correctamente, pero la interfaz presenta errores visuales graves al abrirla en el navegador.

Se han observado los siguientes problemas reales:

1. Iconos SVG extremadamente grandes que ocupan gran parte de la pantalla.
2. Tarjetas meteorológicas desproporcionadas.
3. Elementos desalineados.
4. Espacios vacíos excesivos.
5. Navegación con una distribución incorrecta.
6. Textos demasiado próximos a los bordes.
7. Componentes que parecen desbordarse de sus contenedores.
8. Falta de coherencia visual entre secciones.

OBJETIVO:

Diagnosticar y corregir integralmente el diseño de SkyCast para conseguir una interfaz profesional, responsive, consistente y visualmente equilibrada.

Esta tarea corresponde a una corrección de la Iteración 01, no a una nueva funcionalidad.

## 1. Diagnóstico obligatorio

Antes de modificar código:

- Inspecciona src/app/globals.css.
- Inspecciona src/app/layout.tsx.
- Inspecciona src/components/icon.tsx.
- Inspecciona src/components/ui.tsx.
- Inspecciona src/components/site-header.tsx.
- Inspecciona las seis páginas existentes.
- Revisa la configuración de Tailwind CSS 4.
- Comprueba si los estilos utilitarios se están aplicando correctamente.
- Revisa las dimensiones de los SVG, sus atributos width, height y viewBox.
- Comprueba que las clases recibidas mediante className se apliquen correctamente.
- Revisa si existen reglas CSS globales que alteren el tamaño de iconos, tarjetas o contenedores.
- Investiga si algún componente utiliza clases dinámicas de Tailwind que no estén siendo detectadas.

No soluciones los problemas únicamente ocultando elementos o agregando overflow-hidden indiscriminadamente.

Identifica y corrige la causa real de cada problema.

## 2. Corrección de iconos SVG

Todos los iconos deben tener dimensiones controladas.

Requisitos:

- Definir tamaños predeterminados razonables.
- Permitir personalizar dimensiones mediante className.
- Evitar que los SVG ocupen el ancho completo de sus contenedores.
- Utilizar viewBox correctamente.
- Mantener proporciones.
- Evitar duplicaciones innecesarias.
- Comprobar el funcionamiento de todos los iconos disponibles.

## 3. Corrección de layout y componentes

Revisar y corregir:

- Ancho máximo de contenedores.
- Márgenes y paddings.
- Distribución mediante Grid y Flexbox.
- Alineación vertical y horizontal.
- Tamaños de tarjetas.
- Espaciado entre secciones.
- Jerarquía tipográfica.
- Dimensiones de botones.
- Distribución de navegación.
- Proporciones de iconos y textos.

Evitar alturas fijas innecesarias y espacios vacíos exagerados.

Los componentes deben adaptarse al contenido sin provocar desbordamientos.

## 4. Diseño profesional

Mantener una identidad visual meteorológica moderna.

Utilizar:

- Colores inspirados en el cielo.
- Tarjetas equilibradas.
- Bordes y sombras sutiles.
- Tipografía consistente.
- Botones correctamente dimensionados.
- Iconografía proporcionada.
- Espaciado uniforme.
- Interfaz intuitiva.
- Navegación clara.

No agregar elementos decorativos gigantes que perjudiquen la experiencia de usuario.

## 5. Responsive

Verificar el comportamiento de las seis rutas en:

- Móvil: 375 px.
- Tableta: 768 px.
- Escritorio: 1440 px.

Requisitos:

- Sin scroll horizontal inesperado.
- Tarjetas correctamente distribuidas.
- Navegación adaptable.
- Textos legibles.
- Botones utilizables.
- Iconos proporcionados.
- Contenido dentro de los contenedores.

## 6. Alcance de la corrección

Aplicar las correcciones necesarias a todas las rutas:

- /
- /buscar
- /pronostico
- /favoritos
- /comparar
- /acerca-de

No limitarte a corregir únicamente la página principal.

No modificar las funcionalidades previstas ni integrar todavía Open-Meteo.

## 7. Clean Code

Cumplir AGENTS.md.

Mantener:

- TypeScript estricto.
- Componentes reutilizables.
- Separación de responsabilidades.
- Prettier.
- UTF-8.
- Textos correctamente escritos en español.
- JSX legible.
- Sin archivos comprimidos en una sola línea.
- Sin dependencias innecesarias.

## 8. Documentación

Registrar este prompt completo en VIBE_CODING.md como una corrección visual de la Iteración 01.

Documentar:

- Problemas detectados.
- Causas identificadas.
- Archivos modificados.
- Soluciones implementadas.
- Decisiones técnicas.
- Pruebas ejecutadas.
- Resultados reales.

No inventar verificaciones visuales ni resultados.

## 9. Validaciones obligatorias

Ejecutar:

pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd encoding:check

Además, si dispones de una herramienta de navegador, inspecciona visualmente las seis páginas en los tamaños indicados.

Si no tienes acceso al navegador, informa expresamente que la revisión visual sigue pendiente.

## 10. Restricciones

- No implementar nuevas funcionalidades.
- No integrar la API meteorológica.
- No agregar persistencia.
- No modificar archivos fuera de SkyCast.
- No realizar commits ni push automáticamente.
- No ocultar errores visuales mediante soluciones superficiales.
- No declarar la corrección completada sin comprobar las causas y ejecutar las validaciones disponibles.

Al finalizar, proporciona un resumen de las causas identificadas, correcciones aplicadas, archivos modificados y resultados de las verificaciones.

No avances a la Iteración 02.
```

## 5. Corrección integral de la Iteración 01

### Prompt completo

```text
Actúa como ingeniero frontend senior especializado en Next.js 16, React 19, TypeScript, Tailwind CSS 4, diseño UI/UX, Responsive Web Design, accesibilidad y Clean Code.

Estamos desarrollando SkyCast, una aplicación web meteorológica mediante Vibe Coding.

He revisado visualmente la aplicación en el navegador y he confirmado que TODAS las páginas presentan problemas importantes de diseño y responsividad.

OBJETIVO PRINCIPAL:

Realizar una auditoría, corrección y mejora integral de toda la interfaz de SkyCast para conseguir una aplicación moderna, profesional, completamente responsive, accesible y visualmente consistente.

No quiero correcciones superficiales ni modificaciones aisladas. Necesito que identifiques las causas raíz y soluciones los problemas globalmente, respetando las buenas prácticas de Next.js y Tailwind CSS.

## 1. Diagnóstico obligatorio

Antes de modificar archivos, inspecciona toda la estructura del frontend, especialmente:

- src/app/globals.css
- src/app/layout.tsx
- src/app/page.tsx
- src/app/buscar/page.tsx
- src/app/pronostico/page.tsx
- src/app/favoritos/page.tsx
- src/app/comparar/page.tsx
- src/app/acerca-de/page.tsx
- src/components/icon.tsx
- src/components/ui.tsx
- src/components/site-header.tsx
- src/lib/demo-weather.ts
- Configuración de Tailwind CSS 4.
- Configuración de Next.js.
- Configuración de Prettier.

Investiga especialmente:

1. Si Tailwind CSS 4 está cargando correctamente.
2. Si las clases utilitarias están presentes en el CSS generado.
3. Si las clases de Grid y Flexbox funcionan como se espera.
4. Si los SVG reciben dimensiones correctas.
5. Si los componentes compartidos respetan sus propiedades className.
6. Si existen estilos globales que afectan negativamente la interfaz.
7. Si hay elementos que exceden el tamaño de sus contenedores.
8. Si existen anchos, alturas o márgenes que provocan desbordamientos.
9. Si la navegación está diseñada correctamente para móviles y escritorio.
10. Si las reglas responsive se aplican realmente en los puntos de ruptura correspondientes.

No asumas que toda la causa está en los iconos. Diagnostica también la configuración y aplicación real de los estilos.

## 2. Corrección del sistema de iconos

El componente Icon actualmente no define dimensiones predeterminadas en su elemento SVG.

Corrige este problema.

Requisitos:

- Todos los iconos deben tener un tamaño predeterminado razonable, por ejemplo 24 × 24 píxeles.
- Permitir personalizar el tamaño mediante propiedades o clases.
- Mantener correctamente el viewBox.
- Evitar deformaciones.
- Evitar iconos que ocupen todo el ancho disponible.
- Aplicar correctamente las clases recibidas.
- Mantener accesibilidad y uso semántico apropiado.
- Revisar todas las instancias donde se utiliza Icon.

No reemplaces los SVG originales salvo que exista una justificación técnica.

## 3. Corrección global del layout

Revisa y mejora:

- Contenedor principal.
- Header.
- Navegación.
- Footer.
- Secciones.
- Tarjetas.
- Avisos informativos.
- Botones.
- Tipografía.
- Espaciados.
- Iconografía.
- Distribución de contenido.

Requisitos:

- Ancho máximo coherente para el contenido.
- Márgenes horizontales adecuados.
- Espaciado vertical consistente.
- Tarjetas proporcionadas.
- Textos correctamente alineados.
- Elementos visualmente equilibrados.
- Sin espacios vacíos excesivos.
- Sin componentes gigantes.
- Sin desbordamientos horizontales.
- Sin contenido cortado.
- Sin elementos superpuestos.

Evita utilizar medidas fijas innecesarias que afecten la adaptación del diseño.

No utilices overflow-hidden para ocultar errores estructurales.

## 4. Diseño responsive obligatorio

La aplicación debe adaptarse correctamente a:

Móviles:
- 320 px.
- 375 px.
- 430 px.

Tabletas:
- 768 px.
- 1024 px.

Escritorio:
- 1280 px.
- 1440 px.
- 1920 px.

Aplicar un enfoque mobile-first.

En móviles:

- Navegación mediante menú adaptable y accesible.
- Tarjetas organizadas en una columna cuando corresponda.
- Textos legibles.
- Botones fáciles de utilizar.
- Márgenes adecuados.
- Iconos proporcionados.
- Sin desplazamiento horizontal inesperado.

En tabletas:

- Distribución equilibrada.
- Tarjetas adaptadas al espacio disponible.
- Navegación funcional.
- Uso eficiente del espacio.

En escritorio:

- Navegación horizontal bien alineada.
- Uso adecuado de Grid y Flexbox.
- Tarjetas distribuidas en columnas.
- Contenedores con ancho máximo.
- Jerarquía visual profesional.

Los componentes deben responder correctamente al cambio de resolución sin deformarse.

## 5. Mejorar las seis páginas

Revisa y corrige individualmente las siguientes rutas después de solucionar los componentes compartidos:

### Inicio (/)

- Hero equilibrado.
- Tarjeta principal meteorológica proporcionada.
- Botones bien posicionados.
- Distribución coherente entre texto e información meteorológica.
- Sin iconos gigantes ni espacios vacíos excesivos.

### Buscar (/buscar)

- Encabezado correctamente espaciado.
- Área de búsqueda proporcionada.
- Tarjetas de ciudades organizadas.
- Diseño preparado para resultados reales.
- Sin elementos que se desborden.

### Pronóstico (/pronostico)

- Secciones para pronóstico horario y diario.
- Tarjetas meteorológicas proporcionadas.
- Distribución responsive.
- Información legible.
- Sin columnas excesivamente estrechas.

### Favoritos (/favoritos)

- Estado vacío centrado y correctamente dimensionado.
- Tarjetas preparadas para ciudades favoritas.
- Botones con tamaños adecuados.
- Diseño responsive.

### Comparar (/comparar)

- Distribución adecuada para comparar ciudades.
- Una columna en móviles y dos columnas cuando exista espacio.
- Tarjetas de dimensiones coherentes.
- Información alineada para facilitar la comparación.
- Sin iconos desproporcionados.

### Acerca de (/acerca-de)

- Tarjetas informativas equilibradas.
- Iconos pequeños y proporcionados.
- Distribución responsive.
- Texto legible.
- Sección de tecnologías organizada.

## 6. Identidad visual

Mantén SkyCast como una aplicación meteorológica moderna.

Utiliza:

- Paleta coherente de azules, tonos cielo y colores neutros.
- Tarjetas con bordes o sombras sutiles.
- Tipografía moderna y legible.
- Jerarquía visual clara.
- Espaciado uniforme.
- Botones consistentes.
- Iconos apropiados.
- Estados hover y focus.
- Transiciones discretas cuando aporten valor.

Evita elementos decorativos exagerados.

No es necesario instalar bibliotecas UI adicionales si Tailwind CSS permite resolver correctamente el diseño.

## 7. Accesibilidad

Verifica:

- HTML semántico.
- Navegación mediante teclado.
- Estados de foco visibles.
- Contraste adecuado.
- Botones y enlaces con nombres accesibles.
- Tamaños táctiles razonables.
- Iconos decorativos correctamente ocultos a lectores de pantalla.
- Etiquetas para futuros formularios.
- Respeto por preferencias de movimiento reducido cuando corresponda.

## 8. Clean Code y arquitectura

Respeta todas las reglas de AGENTS.md.

- TypeScript estricto.
- Server Components por defecto.
- Client Components solamente cuando exista una necesidad real.
- Componentes reutilizables.
- Separación de responsabilidades.
- Evitar duplicación.
- Evitar sobreingeniería.
- Identificadores descriptivos.
- Código JSX legible.
- Prettier.
- UTF-8.
- Español correctamente acentuado.
- Sin código comprimido en una sola línea.
- Utilizar exclusivamente pnpm.

## 9. Validación visual

No consideres el trabajo finalizado únicamente porque el código compile.

Si tienes disponible un navegador o herramienta de automatización, realiza pruebas visuales reales en las seis rutas y las resoluciones indicadas.

Comprueba especialmente:

- Dimensiones de SVG.
- Tamaños de tarjetas.
- Alineación.
- Comportamiento responsive.
- Navegación.
- Desbordamiento horizontal.
- Legibilidad del contenido.

Si no tienes acceso al navegador, indica claramente que la validación visual queda pendiente y proporciona instrucciones concretas para realizarla manualmente.

No inventes resultados visuales.

## 10. Documentación Vibe Coding

Registra este prompt completo y original en VIBE_CODING.md dentro de la Iteración 01, como corrección integral del diseño y responsividad.

Documenta:

- Número consecutivo del prompt.
- Objetivo.
- Problemas encontrados.
- Causas identificadas.
- Archivos modificados.
- Soluciones implementadas.
- Decisiones técnicas.
- Pruebas ejecutadas.
- Resultados reales.
- Estado de la corrección.

Conserva los registros anteriores.

No inventes información ni dupliques prompts.

## 11. Validaciones técnicas

Ejecuta:

pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd encoding:check

Si alguna verificación falla, corrige el problema y vuelve a ejecutarla.

## 12. Restricciones

- No implementar funcionalidades meteorológicas nuevas.
- No integrar todavía Open-Meteo.
- No modificar la lógica de datos demostrativos.
- No implementar persistencia.
- No modificar archivos fuera del proyecto.
- No instalar dependencias innecesarias.
- No realizar commits ni push automáticamente.
- No declarar que el diseño está validado sin una comprobación visual real.

RESULTADO ESPERADO:

SkyCast debe tener una interfaz coherente y profesional en las seis rutas, con iconos de tamaños correctos, tarjetas equilibradas, navegación responsive y componentes reutilizables.

Al finalizar, proporciona un informe que incluya:

1. Causas raíz identificadas.
2. Archivos corregidos.
3. Mejoras visuales realizadas.
4. Resultados de las validaciones técnicas.
5. Resultados de las pruebas visuales, si se realizaron.
6. Aspectos pendientes de comprobar.

No avances a la Iteración 02 hasta completar esta corrección.
```

## 6. Propuesta de tamaño para Icon

**Objetivo:** aplicar dimensiones predeterminadas a los SVG. El usuario envió el siguiente fragmento entre las dos solicitudes anteriores:

```tsx
export function Icon({
  name,
  width = 24,
  height = 24,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
```

### Diagnóstico, acciones y decisiones para las entradas 4–6

El CSS de producción y el servido por el servidor de desarrollo contienen utilidades de Tailwind para flex, grid, tamaño y espaciado; no se confirmó un fallo de compilación de Tailwind. El componente `Icon` propagaba `className` y tenía `viewBox`, pero carecía de dimensiones intrínsecas de respaldo. Las páginas utilizan clases literales, sin clases dinámicas de Tailwind identificadas. El diseño tenía navegación móvil horizontal desplazable, espacios mínimos fijos y elementos que podían competir por el ancho en pantallas pequeñas; la causa concreta de todos los síntomas observados por el usuario requiere validación visual.

Se aplicó la propuesta de 24 × 24 píxeles con tamaños personalizables, un menú móvil nativo con `details` y enlaces de teclado, disposición flexible de tarjetas y búsqueda, y se retiraron el círculo decorativo gigante y alturas mínimas innecesarias. Los datos demostrativos y las configuraciones de Tailwind y Next.js se conservaron. Se modificaron `src/components/icon.tsx`, `src/components/site-header.tsx`, `src/components/ui.tsx`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/buscar/page.tsx`, `src/app/favoritos/page.tsx` y esta bitácora.

### Pruebas y estado

`pnpm.cmd format:check` detectó inicialmente formato pendiente en esta bitácora; se aplicó Prettier y la comprobación posterior pasó. `pnpm.cmd lint`, `pnpm.cmd build` y `pnpm.cmd encoding:check` finalizaron correctamente; el build incluyó las seis rutas. Se compararon ambos prompts adjuntos con el contenido guardado y coincidieron íntegramente. El intento de iniciar Edge en modo automatizado no produjo un navegador accesible, por lo que no se comprobó visualmente ninguna resolución. Estado: correcciones de código y validaciones técnicas completadas; revisión visual y confirmación de los síntomas originales pendientes.

## 7. Iteración 02: integración con Open-Meteo

### Prompt completo

```text
Actúa como ingeniero de software senior especializado en Next.js 16, React 19, TypeScript, APIs REST, seguridad, Clean Code y testing.

Estamos desarrollando SkyCast mediante Vibe Coding con OpenAI Codex en VS Code.

ESTADO ACTUAL:
- Next.js 16.4.6 con App Router.
- React 19.3.0.
- TypeScript estricto.
- Tailwind CSS 4.
- pnpm como único gestor de paquetes.
- Seis rutas implementadas.
- Configuración de Prettier y UTF-8.
- AGENTS.md y VIBE_CODING.md.
- Iteración 01 completada.

Antes de trabajar, lee AGENTS.md e inspecciona la arquitectura existente.

OBJETIVO:
Implementar exclusivamente la Iteración 02: integración de Open-Meteo mediante Route Handlers de Next.js.

No modificar todavía la interfaz visual.

## 1. Integración con Open-Meteo

Utilizar la documentación oficial:

Geocoding API:
https://open-meteo.com/en/docs/geocoding-api

Forecast API:
https://open-meteo.com/en/docs

Implementar dos endpoints internos:

GET /api/ciudades?nombre=San%20Salvador

GET /api/clima?latitud=13.69&longitud=-89.19

La API de ciudades debe consultar el servicio de geocodificación de Open-Meteo.

La API del clima debe consultar el servicio meteorológico de Open-Meteo.

## 2. API de ciudades

Implementar:

- Búsqueda por nombre.
- Validación de parámetros.
- Longitud mínima de búsqueda de dos caracteres.
- Límite razonable de longitud.
- Manejo de resultados vacíos.
- Manejo de ciudades con nombres repetidos.
- Identificación mediante ID, país, región, latitud y longitud.
- Respuestas tipadas.
- Mensajes de error claros.
- Idioma español cuando la API permita traducciones.

No asumir que el nombre de una ciudad es único.

## 3. API meteorológica

Consultar los siguientes datos cuando estén disponibles:

Condiciones actuales:
- Temperatura.
- Sensación térmica.
- Humedad relativa.
- Velocidad del viento.
- Código meteorológico.
- Estado de día o noche.
- Hora de actualización.

Pronóstico por horas:
- Fecha y hora.
- Temperatura.
- Probabilidad de precipitación.
- Código meteorológico.

Pronóstico diario:
- Fecha.
- Temperatura máxima.
- Temperatura mínima.
- Probabilidad máxima de precipitación.
- Código meteorológico.

Utilizar pronósticos de siete días.

Configurar correctamente la zona horaria de cada ubicación utilizando los parámetros admitidos por Open-Meteo.

No confundir horas UTC con horas locales de las ciudades.

No inventar valores cuando la API devuelva datos incompletos.

## 4. Arquitectura

Separar responsabilidades entre:

- Route Handlers.
- Servicios de consulta a Open-Meteo.
- Tipos de datos.
- Validaciones.
- Transformación de respuestas.
- Manejo de errores.

Mantener las credenciales y configuraciones de servidor fuera del navegador cuando corresponda.

No introducir una base de datos.

No exponer detalles internos de errores en las respuestas públicas.

Evitar lógica duplicada.

## 5. Validación y seguridad

Validar:

- Latitud entre -90 y 90.
- Longitud entre -180 y 180.
- Números finitos.
- Parámetros ausentes.
- Búsquedas demasiado cortas o largas.
- Respuestas HTTP no satisfactorias.
- Errores de conexión.
- Tiempo de espera de solicitudes.
- Respuestas JSON malformadas.
- Estructuras inesperadas de la API externa.

Construir las solicitudes únicamente hacia los dominios oficiales esperados de Open-Meteo.

No permitir que los parámetros del usuario controlen libremente la URL del servidor externo.

Utilizar códigos HTTP coherentes, por ejemplo:

400: solicitud inválida.
502: respuesta inválida del proveedor.
503: servicio temporalmente no disponible.
504: tiempo de espera agotado.

## 6. Next.js 16

El proyecto tiene activados cacheComponents y partialPrefetching.

Revisar las convenciones actuales de Route Handlers y su comportamiento de caché.

Evitar técnicas obsoletas de versiones anteriores.

Definir una estrategia razonable de actualización de datos meteorológicos, sin presentar información antigua como actual.

No modificar innecesariamente next.config.ts.

## 7. Pruebas

Implementar pruebas automatizadas para las validaciones y transformaciones principales, utilizando mocks del servicio externo cuando corresponda.

Verificar:

- Búsqueda válida.
- Búsqueda inválida.
- Resultados vacíos.
- Coordenadas válidas.
- Coordenadas inválidas.
- Respuesta meteorológica correcta.
- Error HTTP del proveedor.
- Datos malformados.
- Tiempo de espera agotado.

Evitar pruebas que dependan permanentemente de la disponibilidad de Internet.

Si el entorno tiene acceso a Internet, realizar también una prueba real de integración y documentarla separadamente.

No afirmar que se realizaron solicitudes reales si no se ejecutaron.

## 8. Variables de entorno

Utilizar las variables de configuración necesarias.

Actualizar .env.example sin incluir secretos.

No crear una API key ficticia.

No utilizar NEXT_PUBLIC_ para información sensible.

## 9. Calidad obligatoria

Cumplir AGENTS.md.

- Clean Code.
- TypeScript estricto.
- UTF-8.
- Español correctamente acentuado.
- Prettier.
- Código legible y organizado.
- Componentes y servicios con responsabilidades claras.
- Sin dependencias innecesarias.
- Utilizar exclusivamente pnpm.cmd.

## 10. Documentación

Registrar este prompt completo en VIBE_CODING.md como Iteración 02.

Documentar:

- Objetivo.
- Prompt original.
- Archivos creados.
- Archivos modificados.
- Decisiones técnicas justificadas.
- Errores encontrados.
- Soluciones aplicadas.
- Pruebas ejecutadas.
- Resultados reales.
- Estado de la iteración.

No inventar resultados.

## 11. Validaciones finales

Ejecutar:

pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd encoding:check

Ejecutar también las pruebas automatizadas incorporadas.

Corregir los errores introducidos antes de finalizar.

## 12. Restricciones

- No modificar el diseño de las seis páginas.
- No implementar todavía la búsqueda interactiva.
- No implementar favoritos.
- No implementar comparación visual.
- No agregar autenticación ni base de datos.
- No crear commits ni realizar push.
- No modificar archivos externos al proyecto.

RESULTADO ESPERADO:

Una API interna funcional, tipada y comprobable para consultar ciudades y datos meteorológicos reales desde Open-Meteo.

Al finalizar, proporcionar ejemplos de URLs locales para probar los endpoints y un resumen de las validaciones realizadas.

No avances a la Iteración 03.
```

### Objetivo y acciones

Implementar dos Route Handlers internos para geocodificación y pronóstico, sin modificar la interfaz. Se crearon `src/app/api/ciudades/route.ts`, `src/app/api/clima/route.ts`, los módulos de `src/lib/open-meteo/` para tipos, validación, errores, servicio y transformación, y `tests/open-meteo.test.mjs`.

### Decisiones y archivos modificados

Se modificaron `package.json` para incorporar las pruebas, `tsconfig.json` para permitir importaciones explícitas de TypeScript compatibles con el ejecutor nativo de Node, `.env.example` para aclarar que no se necesita clave y `scripts/check-encoding.mjs` para evitar que el detector confunda rutas con parámetros de consulta con palabras dañadas. Esta bitácora conserva el prompt. Se usaron dominios fijos, un límite de ocho segundos, sin caché, parámetros de zona horaria automática y valores `null` para datos ausentes. Las fechas y horas devueltas son locales a la zona indicada; el desplazamiento UTC se proporciona como metadato del proveedor. Las respuestas públicas no exponen excepciones internas. No se agregaron dependencias ni se cambió `next.config.ts`.

### Problemas, pruebas y resultados

Las seis pruebas automatizadas con respuestas simuladas pasaron; cubren búsquedas válidas e inválidas, homónimos, resultados vacíos, coordenadas inválidas, transformación, JSON y estructuras inválidas, fallo HTTP, conexión y timeout. Node 22 emitió un aviso de detección de módulo al ejecutar las pruebas, sin afectar el resultado. La primera consulta real falló por la restricción de red; con acceso autorizado, la geocodificación devolvió 10 resultados y el pronóstico del primero devolvió zona `America/El_Salvador`, 168 horas y siete días. El detector de codificación señaló inicialmente las URLs del prompt como falsos positivos; se ajustó para distinguir rutas con parámetros de texto dañado.

Las comprobaciones `pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build`, `pnpm.cmd encoding:check` y `pnpm.cmd test` terminaron correctamente. El build muestra ambas rutas API dinámicas y las seis páginas; las seis pruebas automatizadas pasaron.

### Estado final

Iteración 02 completada. No se modificó la interfaz ni se realizaron commits o push.

## 8. Iteración 03: búsqueda interactiva

### Prompt completo

```text
Actúa como ingeniero frontend senior especializado en Next.js 16, React 19, TypeScript, Tailwind CSS 4, accesibilidad, APIs REST y Clean Code.

Estamos desarrollando SkyCast mediante Vibe Coding con OpenAI Codex.

La Iteración 02 ya implementó los siguientes endpoints:

- GET /api/ciudades?nombre=...
- GET /api/clima?latitud=...&longitud=...

Antes de modificar archivos, lee AGENTS.md, inspecciona los tipos y servicios existentes y revisa VIBE_CODING.md.

OBJETIVO:

Implementar la Iteración 03: búsqueda interactiva de ciudades utilizando la API interna existente.

No integrar todavía los pronósticos completos, favoritos ni comparación de ciudades.

## 1. Búsqueda funcional

Convertir /buscar en una página interactiva.

El usuario debe poder:

- Escribir el nombre de una ciudad.
- Buscar ciudades de diferentes países.
- Visualizar resultados reales desde /api/ciudades.
- Distinguir ciudades que comparten nombre.
- Consultar país y región cuando estén disponibles.
- Seleccionar una ciudad.
- Recibir información clara cuando no existan coincidencias.

Utilizar los tipos reales de la API implementada anteriormente.

No inventar datos meteorológicos ni utilizar resultados demostrativos como si fueran reales.

## 2. React y Client Components

Mantener la página como Server Component cuando sea apropiado y crear un Client Component para el buscador.

Utilizar:

- useState para término de búsqueda, resultados, loading, errores y selección.
- useEffect para consultar la API cuando cambie la búsqueda.
- AbortController para cancelar solicitudes anteriores.
- Debounce aproximado de 350 ms para evitar solicitudes excesivas.

Limpiar correctamente los efectos para evitar condiciones de carrera y actualizaciones obsoletas.

No realizar consultas con términos vacíos o demasiado cortos.

## 3. Estados de interfaz

Implementar:

- Estado inicial con instrucciones.
- Estado de búsqueda en progreso.
- Estado con resultados.
- Estado sin resultados.
- Estado de error.
- Opción para reintentar.
- Estado visual de ciudad seleccionada, cuando corresponda.

No mostrar resultados anteriores como si correspondieran a una búsqueda nueva.

No dejar indicadores de carga activos permanentemente.

## 4. Diseño y responsividad

Respetar la identidad visual de SkyCast.

Requisitos:

- Buscador moderno y fácil de utilizar.
- Resultados presentados en tarjetas proporcionadas.
- Diseño mobile-first.
- Sin desbordamientos horizontales.
- Iconos SVG correctamente dimensionados.
- Espaciado uniforme.
- Estados hover y focus visibles.
- Navegación por teclado.
- Etiqueta accesible para el campo de búsqueda.
- Anuncios accesibles de carga, error y resultados.

Verificar que la búsqueda funcione en móvil y escritorio.

## 5. Selección de ciudades

Al seleccionar una ciudad:

- Conservar su ID cuando esté disponible.
- Conservar nombre, país, región, latitud, longitud y zona horaria si la API la proporciona.
- Evitar identificar ciudades únicamente por su nombre.
- Preparar una navegación hacia /pronostico utilizando los datos de ubicación necesarios.

Si modificas la navegación hacia /pronostico, utiliza parámetros de URL validados y compatibles con la API existente.

No implementar todavía la consulta meteorológica dentro de /pronostico.

No introducir almacenamiento persistente de favoritos en esta iteración.

## 6. Clean Code

Cumplir estrictamente AGENTS.md.

- Utilizar TypeScript estricto.
- No usar any injustificado.
- Separar presentación y lógica de consulta.
- Reutilizar componentes existentes.
- No duplicar tipos de la API.
- No crear componentes gigantes.
- Evitar dependencias innecesarias.
- Utilizar exclusivamente pnpm.
- Mantener Prettier y ESLint.
- Conservar UTF-8 y español correctamente acentuado.

## 7. Pruebas funcionales

Agregar pruebas automatizadas apropiadas para:

- Búsqueda con término válido.
- Término demasiado corto.
- Resultados vacíos.
- Error de la API.
- Cancelación de solicitudes anteriores.
- Selección de ciudades homónimas.
- Manejo de respuestas obsoletas.

Utiliza mocks cuando corresponda.

No afirmar que se probaron interacciones en navegador si no se realizaron.

## 8. Documentación

Registrar este prompt completo en VIBE_CODING.md como Iteración 03.

Documentar:

- Objetivo.
- Prompt original.
- Archivos creados o modificados.
- Decisiones técnicas.
- Errores encontrados.
- Soluciones aplicadas.
- Pruebas ejecutadas.
- Resultados reales.
- Estado final.

No duplicar registros ni inventar resultados.

## 9. Validaciones obligatorias

Ejecutar:

pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd encoding:check

Ejecutar también las pruebas automatizadas correspondientes.

Corregir cualquier error introducido.

Si dispones de navegador, comprobar la búsqueda en resoluciones móviles y escritorio.

Si no dispones de navegador, informar que la comprobación visual y funcional manual queda pendiente.

## 10. Restricciones

- No modificar innecesariamente los Route Handlers existentes.
- No implementar todavía favoritos.
- No implementar comparación meteorológica.
- No añadir una base de datos.
- No modificar funcionalidades fuera de /buscar y los componentes compartidos necesarios.
- No realizar commits ni push automáticamente.

RESULTADO ESPERADO:

Una búsqueda de ciudades completamente funcional, responsive, accesible y conectada a la API interna de SkyCast.

Al finalizar, proporciona un resumen de cambios, resultados de pruebas e instrucciones para comprobar manualmente la búsqueda.

No avances a la Iteración 04.
```

### Objetivo, acciones y archivos

Conectar `/buscar` a la API interna con una búsqueda interactiva. Se modificó `src/app/buscar/page.tsx`, se crearon `src/components/city-search.tsx`, `src/lib/city-search.ts` y `tests/city-search.test.mjs`, y se actualizó esta bitácora.

### Decisiones técnicas y problemas

La página permanece como Server Component y el componente interactivo usa el tipo `Ciudad` existente. La consulta espera 350 ms, cancela la solicitud previa y descarta resultados obsoletos; los estados de carga, error y resultados se anuncian de forma accesible. La selección conserva el objeto de la ciudad y se identifica por ID. La API actual no proporciona zona horaria. El enlace lleva coordenadas a `/pronostico` e informa expresamente de que esa página todavía muestra datos de ejemplo y no usa la ubicación. Se evita dejar la carga activa al editar espacios que no cambian el término efectivo. No se agregaron dependencias ni persistencia.

### Pruebas y estado final

Las pruebas automatizadas de la lógica cubren términos, respuesta válida con homónimos e IDs distintos, resultados vacíos, error, cancelación y respuesta tardía; no comprueban la selección mediante eventos de navegador. Las 11 pruebas pasaron, así como ESLint, build y la comprobación de codificación. La primera comprobación de formato detectó la bitácora recién ampliada y se corrigió con Prettier. El ejecutor de Node mostró el aviso de detección de módulo ya existente. No se realizó una comprobación visual ni funcional en navegador, que queda pendiente. No se realizaron commits ni push.

## 9. Iteración 04: condiciones y pronóstico reales

### Prompt completo

```text
Actúa como ingeniero frontend senior especializado en Next.js 16, React 19, TypeScript, Tailwind CSS 4, APIs REST, accesibilidad y Clean Code.

Estamos desarrollando SkyCast mediante Vibe Coding.

ESTADO ACTUAL:

- Seis rutas con App Router.
- API interna de Open-Meteo implementada.
- Búsqueda interactiva de ciudades funcional.
- TypeScript estricto.
- Prettier, ESLint y validación UTF-8.
- Uso exclusivo de pnpm.
- Documentación del proceso en VIBE_CODING.md.

Antes de modificar archivos, lee AGENTS.md e inspecciona los tipos y componentes existentes.

OBJETIVO:

Implementar la Iteración 04: mostrar condiciones meteorológicas actuales y pronósticos reales mediante la API interna de SkyCast.

## 1. Página de inicio

Modificar la ruta / para mostrar el clima real de una ciudad predeterminada.

Utilizar inicialmente San Salvador, El Salvador.

Mostrar:

- Nombre y país.
- Temperatura actual.
- Sensación térmica.
- Humedad.
- Velocidad del viento.
- Estado meteorológico.
- Hora de actualización.
- Pronóstico resumido.

Los valores deben proceder de /api/clima o de la misma capa de servicios de servidor existente.

No utilizar datos meteorológicos ficticios como si fueran reales.

## 2. Página de pronóstico

Conectar /pronostico con la API meteorológica existente.

La página debe admitir las coordenadas seleccionadas desde /buscar mediante parámetros de URL.

Validar los parámetros antes de consultar información.

Si no existen parámetros válidos, mostrar una ciudad predeterminada o un mensaje claro.

Mostrar:

- Ciudad seleccionada.
- Condiciones actuales.
- Pronóstico por horas.
- Pronóstico de siete días.
- Temperaturas máximas y mínimas.
- Probabilidad de precipitación.
- Iconos y descripciones meteorológicas.

No identificar ciudades únicamente por sus coordenadas si se dispone de ID y nombre.

## 3. Condiciones meteorológicas

Crear una utilidad compartida que transforme los códigos meteorológicos de Open-Meteo en:

- Descripciones en español.
- Iconos adecuados.
- Estados visuales de día y noche cuando corresponda.

No asumir que todos los códigos son iguales.

Manejar códigos desconocidos sin provocar errores.

## 4. Fechas y zonas horarias

La API proporciona una zona horaria para cada ubicación.

Mostrar fechas y horas respetando la zona horaria de la ciudad consultada.

No aplicar automáticamente la zona horaria del navegador.

No interpretar incorrectamente las fechas locales como UTC.

Evitar errores al cambiar de día.

## 5. Arquitectura Next.js

Mantener Server Components para composición y consultas iniciales cuando corresponda.

Utilizar Client Components únicamente para interacciones que lo requieran.

Reutilizar la capa de servicios de Open-Meteo.

Evitar duplicar lógica de transformación.

No realizar solicitudes HTTP al propio Route Handler desde un Server Component si puede utilizarse directamente el servicio de servidor.

Respetar las convenciones de Next.js 16 y la configuración existente de Cache Components.

## 6. Estados de carga y errores

Implementar:

- loading.tsx en las rutas apropiadas.
- error.tsx como Client Component para errores de renderizado.
- Estados vacíos y de datos incompletos.
- Mensajes claros cuando Open-Meteo no esté disponible.
- Opciones de reintento cuando corresponda.

No mostrar información desactualizada como si fuera actual.

No ocultar errores con datos demostrativos.

## 7. Diseño responsive

Mantener el diseño profesional de SkyCast.

- Tarjetas proporcionadas.
- Iconos con dimensiones correctas.
- Diseño mobile-first.
- Pronóstico horario con navegación horizontal controlada cuando corresponda.
- Sin desplazamiento horizontal de toda la página.
- Buena legibilidad.
- Accesibilidad mediante teclado.
- Estados de foco visibles.

No volver a introducir los problemas de SVG gigantes o tarjetas desbordadas.

## 8. Pruebas

Agregar pruebas automatizadas para:

- Conversión de códigos meteorológicos.
- Valores ausentes.
- Parámetros válidos e inválidos.
- Fechas y zonas horarias.
- Datos incompletos.
- Errores del proveedor.
- Navegación desde la búsqueda.
- Presentación correcta de datos disponibles.

No afirmar que se realizaron pruebas de navegador si no se ejecutaron.

## 9. Documentación

Registrar este prompt completo en VIBE_CODING.md dentro de la Iteración 04.

Documentar:

- Objetivo.
- Prompt original.
- Archivos creados o modificados.
- Decisiones técnicas.
- Problemas y soluciones.
- Pruebas ejecutadas.
- Resultados reales.
- Estado final.

No inventar información.

## 10. Validaciones

Ejecutar:

pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd encoding:check

Ejecutar también las pruebas automatizadas.

Corregir los errores introducidos.

## 11. Restricciones

- No implementar favoritos todavía.
- No implementar comparación meteorológica.
- No agregar base de datos.
- No modificar innecesariamente los endpoints.
- No realizar commits ni push automáticamente.
- No implementar funcionalidades fuera de esta iteración.

RESULTADO ESPERADO:

Las páginas Inicio y Pronóstico deben mostrar información meteorológica real de Open-Meteo, correctamente formateada y adaptable a dispositivos móviles y escritorio.

Al finalizar, proporcionar un resumen de los cambios y resultados de pruebas.

No avances a la Iteración 05.
```

### Objetivo y archivos

Mostrar datos reales en Inicio y Pronóstico utilizando el servicio existente. Se modificaron `src/app/page.tsx`, `src/app/pronostico/page.tsx`, `src/components/city-search.tsx` y `src/components/icon.tsx`. Se crearon `src/components/weather-view.tsx`, `weather-loading.tsx`, `weather-error.tsx`, las convenciones `loading.tsx` y `error.tsx` en ambas rutas, `src/lib/weather-display.ts`, `src/lib/forecast-location.ts` y `tests/weather-display.test.mjs`.

### Decisiones, problemas y soluciones

Las páginas son componentes de servidor y llaman directamente al servicio sin caché; muestran errores con opción de reintento, valores ausentes explícitos y estados vacíos. La búsqueda transmite ID, nombre, región, país y coordenadas validadas. Los códigos meteorológicos se traducen según la tabla de Open-Meteo; los datos desconocidos no se inventan. Las fechas ISO se presentan tal como las entrega el proveedor, sin aplicar la zona del navegador. La documentación oficial señala que Open-Meteo usa el desplazamiento UTC vigente al solicitar fechas ISO y no ajusta cambios de horario de verano dentro del intervalo; se advierte esta limitación en la interfaz. Para una corrección completa durante esas transiciones sería necesario adaptar el servicio a marcas Unix y revisar los límites diarios. No se modificaron los endpoints.

### Pruebas y estado

Las 15 pruebas automatizadas pasaron e incluyen códigos, valores faltantes, fechas, parámetros, navegación con identidad y pruebas existentes de errores y datos incompletos del proveedor. `pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build` y `pnpm.cmd encoding:check` terminaron correctamente. La compilación reconoce Inicio y Pronóstico como rutas con contenido dinámico transmitido bajo Cache Components. No se realizó prueba de navegador ni se validó la presentación visual. Queda pendiente la precisión durante transiciones de horario de verano indicada arriba; no se realizaron commits ni push.

## 10. Corrección de zonas horarias de la Iteración 04

### Prompt completo

```text
Actúa como ingeniero senior especializado en Next.js 16, TypeScript, APIs meteorológicas, manejo de fechas y zonas horarias.

Estamos desarrollando SkyCast mediante Vibe Coding.

La Iteración 04 ya implementó el clima actual y los pronósticos reales, pero Codex identificó una limitación al manejar transiciones de horario de verano.

OBJETIVO:

Corregir el tratamiento de fechas y zonas horarias para que SkyCast muestre correctamente las horas locales de cada ciudad, incluso cuando el pronóstico atraviese una transición de horario de verano.

## 1. Diagnóstico

Antes de modificar código:

- Lee AGENTS.md.
- Inspecciona el servicio de Open-Meteo.
- Revisa las transformaciones de fechas.
- Identifica cómo se utiliza zonaHoraria y desfaseUtcSegundos.
- Comprueba cómo se construyen y formatean las fechas ISO.
- Revisa las páginas Inicio y Pronóstico.

La documentación oficial de Open-Meteo indica que utc_offset_seconds representa un desplazamiento fijo y puede ignorar transiciones DST dentro del período solicitado.

No asumas que ese desplazamiento es válido para todas las fechas futuras.

## 2. Corrección

Implementa una estrategia robusta que:

- Utilice la zona horaria IANA de la ubicación.
- Respete las transiciones de horario de verano.
- Mantenga correctamente los instantes del pronóstico.
- Evite aplicar un desplazamiento UTC fijo a todas las fechas.
- Distinga entre fechas locales, instantes UTC y etiquetas de calendario.
- Evite conversiones dobles.
- Utilice Intl.DateTimeFormat con timeZone cuando corresponda.
- Evite depender de la zona horaria del navegador.

Evalúa utilizar el formato unixtime de Open-Meteo para los instantes horarios, manteniendo la zona horaria IANA para presentarlos.

Para fechas diarias, respeta el calendario local de la ubicación y la semántica documentada por Open-Meteo.

No agregues bibliotecas de fechas si las herramientas nativas permiten resolver correctamente el problema.

## 3. Pruebas

Agregar pruebas automatizadas que cubran:

- San Salvador, sin cambio de horario de verano.
- Nueva York, durante una transición de primavera.
- Nueva York, durante una transición de otoño.
- Madrid, durante una transición de horario de verano.
- Cambio de fecha local.
- Datos incompletos.
- Formato de hora de 12 y 24 horas cuando corresponda.

Verificar que el pronóstico horario mantenga un orden temporal correcto y que las fechas mostradas correspondan a la ciudad consultada.

No depender únicamente de la fecha actual para ejecutar las pruebas.

## 4. Interfaz

Eliminar cualquier advertencia temporal sobre limitaciones de horario de verano únicamente si la corrección queda técnicamente validada.

No modificar innecesariamente el diseño.

No introducir nuevas funcionalidades.

## 5. Calidad y documentación

Cumplir AGENTS.md.

Registrar este prompt completo en VIBE_CODING.md como una corrección de la Iteración 04.

Documentar:

- Problema encontrado.
- Causa técnica.
- Estrategia aplicada.
- Archivos modificados.
- Pruebas realizadas.
- Resultados reales.
- Limitaciones que permanezcan.

Mantener UTF-8, Clean Code, TypeScript estricto y uso exclusivo de pnpm.

## 6. Validaciones

Ejecutar:

pnpm.cmd format:check\
pnpm.cmd lint\
pnpm.cmd build\
pnpm.cmd encoding:check

Ejecutar todas las pruebas automatizadas.

No afirmar que se realizaron pruebas visuales si no se ejecutaron.

## 7. Restricciones

- No implementar favoritos.
- No implementar comparación de ciudades.
- No agregar base de datos.
- No modificar componentes ajenos al problema sin justificación.
- No realizar commits ni push automáticamente.

Al finalizar, proporcionar el diagnóstico, las correcciones y los resultados de todas las pruebas.

No avanzar a la Iteración 05.
```

### Diagnóstico y estrategia

El servicio usaba ISO local con un desplazamiento fijo y la interfaz comparaba cadenas locales; al cambiar el horario de verano podía mostrar horas incorrectas y confundir horas repetidas. Ahora solicita `unixtime`, conserva instantes horarios y actuales como ISO UTC explícito y los presenta con `Intl.DateTimeFormat` y la zona IANA. Se ordenan y filtran por instante y se muestra el desplazamiento de cada hora para distinguir las repetidas. Las fechas diarias son etiquetas de calendario obtenidas según el desplazamiento de la respuesta, no instantes de medianoche reinterpretados como hora local.

### Archivos, pruebas y limitaciones

Se modificaron el servicio, la transformación y los tipos de `src/lib/open-meteo/`, `src/lib/weather-display.ts`, `src/components/weather-view.tsx`, ambas páginas, `tests/open-meteo.test.mjs`, `tests/weather-display.test.mjs` y esta bitácora. Las 17 pruebas automatizadas pasaron, con casos de San Salvador, primavera y otoño en Nueva York, Madrid, cambio de fecha, horas de 12 y 24, datos incompletos y orden temporal. Una consulta real a Open-Meteo para Nueva York devolvió 168 horas, siete días y la zona `America/New_York`. La documentación del proveedor indica que los límites de agregación diarios usan el desplazamiento vigente al consultar y pueden no coincidir con los días locales durante una transición; la interfaz mantiene esa advertencia. No se realizaron pruebas visuales.

### Estado final

`pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build`, `pnpm.cmd encoding:check` y `pnpm.cmd test` finalizaron correctamente. Los instantes horarios quedan corregidos y probados; permanece la limitación de los límites de agregación diaria del proveedor indicada arriba. No se realizaron commits ni push.

## 11. Iteración 05: ciudades favoritas

### Prompt completo

```text
Actúa como ingeniero frontend senior especializado en Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Hooks, persistencia local, accesibilidad y Clean Code.

Estamos desarrollando SkyCast mediante Vibe Coding con OpenAI Codex.

La aplicación ya cuenta con búsqueda interactiva de ciudades, API interna de Open-Meteo, clima actual y pronósticos reales.

Antes de modificar archivos, lee AGENTS.md, revisa VIBE_CODING.md e inspecciona los tipos y componentes existentes.

OBJETIVO:

Implementar la Iteración 05: gestión completa de ciudades favoritas mediante localStorage.

## 1. Funcionalidades principales

Permitir que el usuario:

- Agregue ciudades a favoritos desde la página /buscar.
- Consulte sus ciudades guardadas en /favoritos.
- Elimine ciudades de favoritos.
- Evite guardar ciudades duplicadas.
- Conserve sus favoritos después de recargar el navegador.
- Acceda al pronóstico real de cualquier ciudad favorita.

No utilizar datos demostrativos como si fueran favoritos reales.

## 2. Modelo de datos

Reutilizar los tipos de ciudad existentes.

Cada favorito debe conservar:

- ID de la ciudad.
- Nombre.
- País.
- Región, cuando esté disponible.
- Latitud.
- Longitud.

Utilizar el ID para evitar duplicados.

No identificar una ciudad únicamente por su nombre.

## 3. Persistencia local

Utilizar localStorage.

Requisitos:

- Acceder a localStorage únicamente desde el navegador.
- Evitar errores de hidratación de Next.js.
- Manejar datos JSON inválidos.
- Validar los registros recuperados antes de utilizarlos.
- Mantener una estructura de almacenamiento versionable.
- Evitar escrituras innecesarias.
- No sobrescribir los favoritos antes de terminar su carga inicial.
- Manejar posibles errores de almacenamiento.
- Sincronizar los cambios entre pestañas mediante el evento storage cuando corresponda.

No agregar una base de datos ni autenticación.

## 4. React Hooks

Implementar una solución reutilizable para favoritos.

Utilizar useState y useEffect cuando corresponda.

Evitar duplicación de lógica entre páginas.

No introducir bibliotecas globales de estado si React permite resolverlo de forma sencilla.

Mantener una separación clara entre persistencia, estado y presentación.

## 5. Interfaz de búsqueda

Agregar a cada resultado una opción para:

- Guardar en favoritos.
- Quitar de favoritos si ya está guardado.

Los botones deben reflejar correctamente su estado.

Evitar que la acción de favoritos interfiera con la selección o navegación de la ciudad.

Utilizar nombres accesibles para los botones.

## 6. Página de favoritos

Convertir /favoritos en una página funcional.

Mostrar:

- Lista de ciudades favoritas.
- Nombre, país y región.
- Opción para eliminar.
- Enlace al pronóstico de cada ciudad.
- Estado vacío cuando no existan favoritos.
- Mensajes claros cuando ocurra un error de almacenamiento.

No inventar temperaturas actuales.

Si se muestran condiciones meteorológicas, deben consultarse realmente a la API.

## 7. Diseño

Respetar el diseño existente de SkyCast.

- Responsive mobile-first.
- Tarjetas proporcionadas.
- Iconos con dimensiones correctas.
- Botones accesibles.
- Estados hover y focus.
- Sin desplazamiento horizontal inesperado.
- Sin romper la navegación existente.

## 8. Pruebas

Agregar pruebas automatizadas para:

- Agregar favoritos.
- Eliminar favoritos.
- Evitar duplicados.
- Persistencia y recuperación.
- Datos JSON inválidos.
- Registros incompletos.
- Errores de almacenamiento.
- Sincronización entre pestañas cuando corresponda.
- Conservación de ciudades homónimas con ID diferente.

No afirmar que se probaron eventos de navegador si solamente se probaron funciones de almacenamiento.

## 9. Clean Code

Cumplir AGENTS.md.

- TypeScript estricto.
- Componentes reutilizables.
- Código legible.
- Sin any injustificado.
- Prettier.
- UTF-8.
- Español correctamente acentuado.
- Uso exclusivo de pnpm.
- Sin dependencias innecesarias.

## 10. Documentación

Registrar este prompt completo en VIBE_CODING.md como Iteración 05.

Documentar los cambios, decisiones, problemas, soluciones, pruebas y resultados reales.

No inventar información ni duplicar registros.

## 11. Validaciones

Ejecutar:

pnpm.cmd format:check\
pnpm.cmd lint\
pnpm.cmd build\
pnpm.cmd encoding:check

Ejecutar las pruebas automatizadas.

Corregir los errores introducidos.

## 12. Restricciones

- No implementar todavía la comparación de ciudades.
- No introducir base de datos.
- No agregar autenticación.
- No modificar innecesariamente los endpoints.
- No realizar commits ni push automáticamente.
- No avanzar a la siguiente iteración.

RESULTADO ESPERADO:

Una gestión de ciudades favoritas funcional, persistente en el navegador, accesible y correctamente integrada con la búsqueda y los pronósticos reales.

Al finalizar, proporcionar un resumen de archivos modificados, decisiones técnicas y resultados de las pruebas.
```

### Objetivo, archivos y decisiones

Se incorporó la gestión local de favoritos desde la búsqueda y la página de favoritos. Se modificaron `src/components/city-search.tsx`, `src/app/favoritos/page.tsx` y esta bitácora; se crearon `src/components/favorite-cities.tsx`, `src/hooks/use-favorites.ts`, `src/lib/favorites-storage.ts` y `tests/favorites.test.mjs`. El almacenamiento usa una estructura versionada, valida todos los registros y evita escrituras mientras la lectura falla o no termina. Cada modificación vuelve a leer el almacenamiento y se escuchan eventos `storage` de otras pestañas. Los datos malformados no se sobrescriben automáticamente. No se añadieron dependencias ni se modificaron endpoints.

### Pruebas y estado

Las pruebas de funciones de almacenamiento cubren alta, baja, duplicados, homónimos, recuperación, datos inválidos, errores y selección de eventos relevantes. Las 22 pruebas automatizadas pasaron, al igual que `pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build` y `pnpm.cmd encoding:check`. Node emitió el aviso existente de detección de módulo durante las pruebas. No se verificaron eventos reales ni interacciones en navegador, por lo que quedan pendientes la comprobación visual y la sincronización efectiva entre pestañas. No se realizaron commits ni push.

## 12. Iteración 06: comparación de ciudades

### Prompt completo

```text
Actúa como ingeniero frontend senior especializado en Next.js 16, React 19, TypeScript, Tailwind CSS 4, APIs REST, experiencia de usuario, accesibilidad y Clean Code.

Estamos desarrollando SkyCast mediante Vibe Coding con OpenAI Codex en VS Code.

ESTADO ACTUAL:

- Seis rutas implementadas con Next.js App Router.
- API interna de Open-Meteo.
- Búsqueda interactiva de ciudades.
- Condiciones meteorológicas y pronósticos reales.
- Conversión horaria mediante zona horaria IANA.
- Gestión de favoritos con localStorage.
- TypeScript estricto.
- Validación mediante Prettier, ESLint, build y UTF-8.
- Documentación en VIBE_CODING.md.

Antes de trabajar, lee AGENTS.md e inspecciona los servicios, tipos, componentes y páginas existentes.

OBJETIVO:

Implementar la Iteración 06: comparación meteorológica real entre dos ciudades utilizando la infraestructura existente.

No utilizar datos meteorológicos simulados.

## 1. Página /comparar

Convertir la página en una herramienta interactiva y funcional.

El usuario debe poder:

- Buscar la primera ciudad.
- Buscar la segunda ciudad.
- Seleccionar ciudades de distintos países.
- Distinguir ciudades con nombres idénticos.
- Comparar ambas ubicaciones.
- Cambiar cualquiera de las ciudades.
- Intercambiar la posición de las dos ciudades.
- Consultar el pronóstico individual de cualquiera de ellas.

No iniciar la comparación hasta tener dos ubicaciones válidas.

## 2. Selección de ciudades

Reutilizar la lógica de búsqueda y los tipos existentes.

Evitar duplicar el código del buscador.

Permitir buscar ciudades directamente desde /comparar.

Cada selección debe conservar:

- ID.
- Nombre.
- País.
- Región.
- Latitud.
- Longitud.

Identificar cada ciudad por su ID, no por su nombre.

Evitar comparar accidentalmente la misma ciudad consigo misma.

Permitir seleccionar ciudades favoritas si puede integrarse reutilizando el hook existente sin incrementar innecesariamente la complejidad.

## 3. Datos meteorológicos

Consultar /api/clima para ambas ciudades.

Mostrar una comparación de:

- Temperatura actual.
- Sensación térmica.
- Humedad.
- Velocidad del viento.
- Condición meteorológica.
- Temperatura máxima del día.
- Temperatura mínima del día.
- Probabilidad máxima de precipitación.

Usar únicamente valores presentes en la respuesta real.

Si algún dato no está disponible, mostrar «No disponible».

Nunca sustituir valores ausentes por cero.

## 4. Comparación visual

Crear una presentación clara que permita distinguir ambas ciudades.

En escritorio:

- Mostrar las ciudades en dos columnas.
- Alinear las mismas métricas.
- Utilizar tarjetas proporcionadas y fáciles de comparar.

En móvil:

- Adaptar el contenido a una columna o a una presentación compacta.
- Evitar tablas que desborden horizontalmente.
- Conservar etiquetas claras para cada valor.

Incluir diferencias numéricas únicamente cuando tengan sentido.

Por ejemplo, mostrar la diferencia de temperatura en grados Celsius.

No afirmar que una ciudad tiene mejores condiciones únicamente por presentar valores mayores o menores.

No inventar recomendaciones meteorológicas.

## 5. Estado y solicitudes

Utilizar React Hooks correctamente.

- useState.
- useEffect cuando corresponda.
- AbortController para cancelar solicitudes obsoletas.
- Manejo independiente de errores por ciudad.
- Estado de carga durante la consulta.
- Evitar condiciones de carrera.
- No realizar llamadas repetidas innecesariamente.

Gestionar correctamente el caso en que una ciudad cambie mientras se está consultando el clima.

## 6. Fechas y zonas horarias

Las ciudades pueden tener diferentes zonas horarias.

Mostrar claramente la hora local de cada ciudad.

Utilizar la infraestructura de fechas existente.

No asumir que ambas ciudades están en el mismo día.

No utilizar un desplazamiento UTC fijo para convertir los instantes horarios.

Respetar las limitaciones documentadas del proveedor sobre agregados diarios durante transiciones de horario de verano.

## 7. Estados de interfaz

Implementar:

- Estado inicial sin ciudades.
- Estado con una ciudad seleccionada.
- Estado de consulta en progreso.
- Comparación completada.
- Error de una ciudad.
- Error de ambas ciudades.
- Opción para reintentar.
- Datos incompletos.

Los errores de una ciudad no deben ocultar innecesariamente los datos válidos de la otra.

## 8. Accesibilidad y diseño

Mantener la identidad visual de SkyCast.

- Diseño responsive mobile-first.
- Tamaños correctos de SVG.
- Etiquetas accesibles.
- Navegación mediante teclado.
- Indicadores de foco visibles.
- Mensajes de estado accesibles.
- Botones de intercambio con nombres claros.
- Buen contraste.
- Sin desbordamientos horizontales.

## 9. Pruebas

Agregar pruebas automatizadas que cubran:

- Selección de dos ciudades distintas.
- Ciudades homónimas.
- Intento de seleccionar la misma ciudad dos veces.
- Intercambio de ciudades.
- Cálculo correcto de diferencias.
- Valores null.
- Error de una consulta.
- Error de ambas consultas.
- Cancelación de solicitudes obsoletas.
- Ciudades en zonas horarias diferentes.
- Navegación hacia el pronóstico individual.

Utilizar mocks para evitar depender de Open-Meteo en las pruebas automatizadas.

Indicar claramente si no se realizaron pruebas reales de interacción en navegador.

## 10. Arquitectura

- Reutilizar tipos y servicios.
- Evitar duplicar el buscador.
- Evitar duplicar transformaciones meteorológicas.
- Mantener Server Components cuando corresponda.
- Utilizar Client Components para la interacción.
- No introducir una nueva API externa.
- No introducir una base de datos.
- Evitar dependencias innecesarias.

## 11. Documentación Vibe Coding

Registrar este prompt completo en VIBE_CODING.md como Iteración 06.

Incluir:

- Objetivo.
- Prompt original.
- Archivos creados o modificados.
- Decisiones técnicas.
- Problemas encontrados.
- Soluciones.
- Pruebas realizadas.
- Resultados verificables.
- Estado final.

No inventar pruebas ni resultados.

## 12. Validaciones obligatorias

Ejecutar:

pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd encoding:check

Ejecutar además todas las pruebas automatizadas.

Corregir los errores introducidos.

## 13. Restricciones

- No modificar innecesariamente las funcionalidades existentes.
- No implementar autenticación.
- No agregar base de datos.
- No modificar la configuración de despliegue.
- No realizar commits ni push automáticamente.
- No avanzar a la siguiente iteración.

RESULTADO ESPERADO:

Una página /comparar completamente funcional que permita seleccionar dos ciudades y comparar condiciones meteorológicas reales de forma clara, accesible y responsive.

Al finalizar, proporcionar un resumen de cambios, pruebas y limitaciones pendientes.
```

### Objetivo, acciones y archivos

Conectar `/comparar` a las APIs internas para comparar dos ubicaciones. Se modificaron `src/app/comparar/page.tsx` y esta bitácora; se crearon `src/components/comparison.tsx`, `src/components/comparison-selector.tsx`, `src/lib/comparison.ts` y `tests/comparison.test.mjs`.

### Decisiones y problemas

La página sigue siendo Server Component y el estado interactivo está en componentes de cliente. Los selectores reutilizan la lógica de búsqueda existente y el hook de favoritos; se rechaza la misma ciudad por ID. Las solicitudes se cancelan al desmontar o cambiar la ciudad, se gestionan por separado y pueden reintentarse individualmente. El intercambio conserva los paneles identificados por ID. Las métricas no disponibles se muestran como tales; el día se determina con la zona IANA de cada ciudad y se mantiene el aviso sobre los agregados diarios del proveedor. El prompt se guardó con escritura explícita UTF-8. No se añadieron dependencias ni se modificaron endpoints.

### Pruebas y estado

Las pruebas automatizadas con mocks cubren selección, homónimos, duplicados, intercambio, diferencias, valores ausentes, zonas, navegación, fallos de una y ambas consultas y propagación de cancelación. Pasaron las 27 pruebas, `pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build` y `pnpm.cmd encoding:check`. Node emitió el aviso existente de detección de módulo. No se probaron interacciones reales ni el diseño responsive en navegador; esa comprobación queda pendiente. No se realizaron commits ni push.

## 13. Iteración 07: auditoría de calidad

### Prompt completo

```text
Actúa como ingeniero de aseguramiento de calidad (QA), desarrollador senior de Next.js 16, especialista en React 19, TypeScript, accesibilidad web, responsive design y Clean Code.

Estamos desarrollando SkyCast como proyecto académico mediante Vibe Coding con OpenAI Codex.

ESTADO ACTUAL:

- Next.js 16 con App Router.
- React 19.
- TypeScript estricto.
- Tailwind CSS 4.
- API interna conectada a Open-Meteo.
- Búsqueda interactiva de ciudades.
- Clima actual y pronósticos reales.
- Gestión de favoritos mediante localStorage.
- Comparación meteorológica de dos ciudades.
- Seis páginas implementadas.
- 27 pruebas automatizadas reportadas como correctas.
- Documentación de iteraciones en VIBE_CODING.md.

Antes de empezar, lee AGENTS.md, revisa VIBE_CODING.md e inspecciona la estructura completa del proyecto.

OBJETIVO:

Realizar una auditoría integral de SkyCast, encontrar errores, corregir defectos verificables y asegurar que la aplicación esté preparada para su despliegue público.

No desarrollar nuevas funcionalidades.

## 1. Auditoría de las seis páginas

Revisar:

- /
- /buscar
- /pronostico
- /favoritos
- /comparar
- /acerca-de

Verificar que:

- Cada página cumpla su propósito.
- Los enlaces funcionen.
- La navegación sea coherente.
- No existan botones decorativos que aparenten ejecutar acciones.
- No haya información demostrativa presentada como real.
- No existan textos desactualizados que afirmen que una funcionalidad sigue pendiente.
- No existan componentes sin utilizar.
- No haya errores de consola o de renderizado verificables.

La página Acerca de debe describir correctamente las tecnologías y características reales de SkyCast.

## 2. Pruebas de integración

Revisar los flujos completos:

FLUJO A:
Buscar San Salvador → seleccionar ciudad → abrir pronóstico → comprobar datos de esa ubicación.

FLUJO B:
Buscar Madrid → agregar favorito → abrir Favoritos → abrir pronóstico → recargar → verificar persistencia.

FLUJO C:
Guardar San Salvador y Madrid → abrir Comparar → seleccionarlos → consultar clima → intercambiarlos.

FLUJO D:
Eliminar favorito → comprobar que desaparezca de la lista y se actualice su estado en Buscar.

FLUJO E:
Abrir la aplicación sin favoritos → verificar que el estado vacío funcione y ofrezca navegación útil.

FLUJO F:
Simular errores de red y respuestas inválidas → verificar mensajes, reintentos y recuperación.

## 3. Revisión de datos meteorológicos

Verificar:

- Que la ciudad seleccionada corresponda a los datos consultados.
- Que no se confundan ciudades homónimas.
- Que la temperatura no se sustituya por valores ficticios.
- Que los valores null se muestren como no disponibles.
- Que las unidades sean correctas.
- Que los códigos meteorológicos tengan descripciones apropiadas.
- Que los siete días de pronóstico estén correctamente ordenados.
- Que las horas respeten la zona horaria IANA.
- Que el pronóstico horario no mezcle horas locales e instantes UTC.

Conservar documentada la limitación de los agregados diarios de Open-Meteo durante transiciones de horario de verano.

No inventar una solución a una limitación del proveedor.

## 4. Auditoría responsive

Revisar las siguientes anchuras:

- 320 px.
- 375 px.
- 430 px.
- 768 px.
- 1024 px.
- 1440 px.
- 1920 px.

Inspeccionar especialmente:

- Navegación principal.
- Menú móvil.
- Buscador de ciudades.
- Tarjetas meteorológicas.
- Pronóstico por horas.
- Favoritos.
- Comparación de ciudades.
- Formularios y botones.
- Pie de página.

Corregir:

- Desbordamientos horizontales no deseados.
- Iconos SVG gigantes.
- Texto recortado.
- Tarjetas desproporcionadas.
- Problemas de alineación.
- Botones difíciles de utilizar en móviles.
- Espacios vacíos excesivos.

No rediseñar completamente la aplicación; conservar la identidad visual existente.

## 5. Accesibilidad

Revisar:

- Navegación mediante teclado.
- Orden lógico del foco.
- Etiquetas de formularios.
- Nombres accesibles de botones.
- Contraste de texto.
- Estados de focus visibles.
- Mensajes de carga y error.
- Uso correcto de encabezados.
- Semántica de enlaces y botones.
- Navegación móvil.
- Ausencia de elementos interactivos anidados incorrectamente.

Corregir problemas reales sin introducir dependencias innecesarias.

## 6. Persistencia y estado

Revisar:

- Lectura y escritura de localStorage.
- Recuperación después de recargar.
- Prevención de duplicados.
- Manejo de datos corruptos.
- Sincronización entre pestañas.
- Errores de almacenamiento.
- Hidratación entre servidor y cliente.
- Cancelación de solicitudes obsoletas.
- Cambios rápidos de ciudades durante consultas.

No eliminar datos guardados por el usuario como solución a errores.

## 7. Calidad del código

Auditar:

- Tipos TypeScript.
- Componentes innecesariamente grandes.
- Duplicación de código.
- Dependencias sin utilizar.
- Manejo de errores.
- Validaciones de entradas.
- Separación entre Server y Client Components.
- Uso correcto de React Hooks.
- Consultas innecesarias a Open-Meteo.
- Seguridad de los Route Handlers.

Priorizar correcciones que mejoren la estabilidad y mantenibilidad.

Evitar refactorizaciones masivas sin beneficio verificable.

## 8. Pruebas automatizadas

Revisar las pruebas existentes.

Añadir o corregir pruebas para los defectos detectados.

Priorizar pruebas de integración de flujos críticos.

Si existe un navegador automatizable disponible, ejecutar pruebas de interacción reales.

Si no existe, documentar exactamente qué pruebas quedan pendientes de ejecutar manualmente.

No confundir mocks con comprobaciones reales en navegador.

No inventar resultados.

## 9. Rendimiento

Revisar:

- Solicitudes duplicadas.
- Renderizados innecesarios.
- Carga inicial.
- Recursos excesivos.
- Imágenes e iconos.
- Tiempos de espera.
- Manejo de consultas paralelas.

No sacrificar funcionalidad ni accesibilidad por optimizaciones prematuras.

## 10. Documentación

Registrar este prompt completo en VIBE_CODING.md como Iteración 07.

Documentar:

- Objetivo.
- Prompt original.
- Hallazgos.
- Severidad de cada defecto.
- Archivos afectados.
- Correcciones implementadas.
- Pruebas realizadas.
- Resultados verificables.
- Limitaciones pendientes.

Distinguir claramente entre errores corregidos y recomendaciones futuras.

## 11. Validaciones obligatorias

Ejecutar:

pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd build
pnpm.cmd encoding:check

Ejecutar todas las pruebas automatizadas.

Corregir cualquier error introducido.

## 12. Restricciones

- No introducir nuevas funcionalidades.
- No agregar base de datos.
- No implementar autenticación.
- No cambiar de gestor de paquetes.
- No instalar dependencias sin justificación.
- No modificar el diseño global innecesariamente.
- No crear commits ni realizar push.
- No avanzar todavía al despliegue.

RESULTADO ESPERADO:

SkyCast debe quedar revisado técnicamente, con sus defectos corregidos y sus seis páginas listas para una última comprobación funcional antes del despliegue.

ENTREGA FINAL:

Proporciona:

1. Resumen de la auditoría.
2. Defectos encontrados y corregidos.
3. Defectos o limitaciones pendientes.
4. Archivos modificados.
5. Resultado de pruebas automatizadas.
6. Resultado de las cuatro validaciones.
7. Pruebas de navegador realmente ejecutadas.
8. Checklist de pruebas manuales pendientes.

No afirmar que SkyCast está completamente validado si quedan pruebas sin ejecutar.
```

### Objetivo, hallazgos y correcciones

Auditar las rutas y flujos sin añadir funcionalidades ni desplegar. Defectos corregidos:

- **Alta:** las respuestas incompletas de búsqueda y comparación se aceptaban sin validar, con riesgo de fallos de renderizado. Se validan los campos utilizados y se muestran errores existentes.
- **Media:** el menú móvil permanecía abierto al navegar porque el layout compartido conserva estado. Se cierra al elegir un enlace.
- **Media:** el orden del pronóstico diario dependía del proveedor. Se ordenan las fechas preservando sus métricas.
- **Baja:** Acerca de y README describían funcionalidades antiguas y gestores de paquetes no utilizados. Se actualizaron y se retiraron componentes y datos demostrativos sin referencias.

Archivos modificados: `src/app/acerca-de/page.tsx`, `src/components/site-header.tsx`, `src/components/ui.tsx`, `src/lib/city-search.ts`, `src/lib/comparison.ts`, `src/lib/favorites-storage.ts`, `src/lib/open-meteo/transform.ts`, `README.md`, las pruebas `city-search`, `comparison`, `weather-display` y esta bitácora. Se creó `tests/critical-flows.test.mjs` y se eliminó `src/lib/demo-weather.ts`, que no tenía consumidores.

### Pruebas y limitaciones

La prueba de integración de búsqueda, favoritos, pronóstico, intercambio y eliminación usa un proveedor simulado; no representa interacciones de navegador. El servidor local devolvió HTTP 200 para las seis páginas y HTTP 400 para parámetros inválidos de ambas API. Se intentó iniciar Edge en modo automatizado, pero falló por acceso denegado a sus archivos de perfil; no hubo pruebas visuales ni de interacción en navegador. Quedan pendientes los flujos A–F solicitados, comprobaciones de teclado, consola, persistencia y pestañas, y las siete anchuras indicadas. Se mantiene la limitación documentada de agregados diarios de Open-Meteo durante cambios de horario de verano. Pasaron las 30 pruebas automatizadas y `pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd build` y `pnpm.cmd encoding:check`. Node emitió el aviso existente de detección de módulo. La auditoría técnica está realizada, pero la aplicación no está completamente validada para despliegue hasta completar las pruebas de navegador pendientes. No se realizaron commits ni push.

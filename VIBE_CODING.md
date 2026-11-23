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

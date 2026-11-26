<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Estándares permanentes de SkyCast

- Utilizar exclusivamente pnpm y mantener TypeScript estricto.
- Mantener Server Components por defecto; usar Client Components solo cuando la interactividad lo requiera.
- Aplicar Clean Code y separación de responsabilidades, con nombres descriptivos y sin duplicación ni dependencias innecesarias.
- No generar código comprimido en una sola línea. Mantener el formato con Prettier, UTF-8, dos espacios y finales de línea LF.
- Escribir la documentación en español correctamente acentuado y preservar las configuraciones existentes salvo justificación.
- Registrar en `VIBE_CODING.md` las iteraciones significativas con objetivos, acciones, decisiones, problemas, archivos, pruebas verificables y estado. Las solicitudes triviales no necesitan entradas individuales y los cambios técnicos pequeños pueden agruparse. Conservar los prompts originales disponibles en `docs/historial-prompts-originales.md` cuando aporten valor técnico o académico; distinguirlos de las síntesis y no inventar resultados ni prompts anteriores.
- Ejecutar las comprobaciones pertinentes con pnpm y documentar sus resultados reales.
- Utilizar Conventional Commits con el tipo en inglés y la descripción en español. No realizar commits ni push sin autorización.
- No incluir secretos en el repositorio; mantener `.env.example` actualizado con las variables necesarias y sin valores secretos.
- Tras cada modificación, comprobar el contenido real y ejecutar `pnpm.cmd encoding:check` para detectar caracteres españoles dañados y UTF-8 inválido. No canalizar texto no ASCII a procesos nativos desde PowerShell sin comprobar la codificación de salida; preferir escritura explícita UTF-8 y verificar el resultado.

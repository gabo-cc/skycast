import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { TextDecoder } from "node:util";

const excluded = new Set([".git", ".next", "node_modules", "coverage", "build", "out"]);
const extensions = /\.(?:md|json|[cm]?[jt]sx?|css|ya?ml|html|txt|ps1)$/i;
const words = /(?:bit\?cora|configuraci\?n|espa\?ol|c\?digo|est\?ndares)/iu;
const prose = /(?<![\p{L}/])[a-záéíóúñü]{3,}\?[a-záéíóúñü]{2,}\b/iu;
const quotedExamples = new Set([
  '- "Bit\u003fcora" en lugar de "Bitácora".',
  '- "Configuraci\u003fn" en lugar de "Configuración".',
  '- "est\u003fndares" en lugar de "estándares".',
  '- "c\u003fdigo" en lugar de "código".',
  '- "espa\u003fol" en lugar de "español".',
  'Un archivo puede ser UTF-8 válido y contener caracteres dañados como "Bit\u003fcora". Por lo tanto, verificar únicamente que se decodifica como UTF-8 no es suficiente.',
  "- Bit\u003fcora",
  "- Configuraci\u003fn",
  "- espa\u003fol",
  "- c\u003fdigo",
]);
const decoder = new TextDecoder("utf-8", { fatal: true });
let errors = 0;

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await scan(path);
    } else if (entry.isFile() && extensions.test(entry.name)) {
      let contents;
      try {
        contents = decoder.decode(await readFile(path));
      } catch (error) {
        console.error(`${path}: no se pudo leer como UTF-8: ${error.message}`);
        errors++;
        continue;
      }
      for (const [index, line] of contents.split(/\r?\n/).entries()) {
        const isExample = path === "VIBE_CODING.md" && quotedExamples.has(line);
        const isProse = /\.(?:md|txt)$/i.test(path);
        if (
          !isExample &&
          (line.includes("\uFFFD") || words.test(line) || (isProse && prose.test(line)))
        ) {
          console.error(`${path}:${index + 1}: posible texto dañado`);
          errors++;
        }
      }
    }
  }
}

await scan(".");
if (errors) {
  console.error(`${errors} línea(s) o archivo(s) requieren revisión.`);
  process.exitCode = 1;
} else {
  console.log("UTF-8 y patrones de corrupción verificados.");
}

import { readLines } from "./io.js";

export async function readTranslations(path) {
  const entries = new Map();
  let e = null;
  let t = null;
  for await (const line of readLines(path)) {
    if (line.startsWith("    ")) {
      t.definitions.push(line.substring(4).trim());
      continue;
    }
    if (line.startsWith("  ")) {
      const words = line.substring(2).split(/\s*,\s*/g);
      e.translations.push((t = { words, definitions: [] }));
      continue;
    }
    const [word, pos] = line.split(/\s+/g, 2);
    entries.set(`${pos}:${word}`, (e = { word, pos, translations: [] }));
  }
  return entries;
}

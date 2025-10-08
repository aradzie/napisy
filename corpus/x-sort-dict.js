import { writeFile } from "node:fs/promises";
import { readCsvFile } from "../lib/csv.js";
import { Dictionary } from "../lib/dictionary.js";
import { pathTo } from "../lib/io.js";

const dictionary = await Dictionary.load();
const lines = [];
for (const { lemma, pos, senses, synonyms } of await loadFrequencyDictionary(pathTo("corpus/freq-all.csv"))) {
  let line = `${lemma}|${pos}|${senses.join(", ")}`;
  if (synonyms.length > 0) {
    line += ` ;;; ${synonyms.join(", ")}`;
  }
  lines.push(line);
}
await writeFile(pathTo("corpus/dict-all.txt"), lines.join("\n") + "\n");

async function loadFrequencyDictionary(path) {
  const list = [];
  for (const [lemma, pos, ppm] of await readCsvFile(path)) {
    const {
      senses, //
      synonyms,
    } = dictionary.get(pos, lemma) ?? {
      pos,
      lemma,
      senses: [],
      synonyms: [],
    };
    list.push({
      lemma,
      pos,
      senses,
      synonyms,
      ppm: Number(ppm),
    });
  }
  return list.sort((a, b) => b.ppm - a.ppm);
}

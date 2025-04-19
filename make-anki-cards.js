import { glob, writeFile } from "node:fs/promises";
import { parse } from "node:path";
import { formatNotes } from "./lib/anki.js";

for await (const file of glob(`out/**/*.json`)) {
  const { dir, name } = parse(file);
  const inputFile = `./${dir}/${name}.json`;
  const outputFile = `./${dir}/${name}-anki.txt`;
  const { default: pairs } = await import(inputFile, { with: { type: "json" } });
  await writeFile(
    outputFile,
    formatNotes(
      pairs.map(([pl, ru]) => ({
        type: `Basic`,
        deck: `Napisy::${name}`,
        tags: `Napisy ${name}`,
        front: ru,
        back: pl,
      })),
    ),
  );
  console.log(`Converted ${inputFile} to ${outputFile}`);
}

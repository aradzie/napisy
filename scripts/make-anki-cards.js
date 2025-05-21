import { glob, readFile, writeFile } from "node:fs/promises";
import { parse } from "node:path";
import { formatNotes } from "../lib/anki.js";
import { pathTo } from "../lib/io.js";

for await (const file of glob(`data/**/*.json`, { cwd: pathTo(".") })) {
  const { dir, name } = parse(file);
  const inputFile = pathTo(`${dir}/${name}.json`);
  const outputFile = pathTo(`${dir}/${name}.anki.txt`);
  const pairs = JSON.parse(await readFile(inputFile, "utf-8"));
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

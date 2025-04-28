import { readFile, writeFile } from "node:fs/promises";
import { parse } from "node:path";
import { pathTo } from "../lib/io.js";

await scanTextPairs(pathTo("input/phrases.txt"));

async function scanTextPairs(file) {
  const { name } = parse(file);
  const lines = (await readFile(file, "utf-8")).split("\n");
  const pairs = [];
  for (const line of lines) {
    if (line) {
      const [q, a] = line.split("|");
      pairs.push([a, q]);
    }
  }
  await writeFile(`data/${name}.json`, JSON.stringify(pairs, null, 2));
}

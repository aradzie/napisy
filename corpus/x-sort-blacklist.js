import { readFile, writeFile } from "node:fs/promises";
import { Blacklist } from "../lib/blacklist.js";
import { collator } from "../lib/text.js";

for (const path of await Blacklist.findFiles()) {
  const text = await readFile(path, "utf-8");
  const words = text
    .normalize("NFC")
    .toLocaleLowerCase("pl")
    .split(/\s+/g)
    .map((line) => line.trim())
    .filter(Boolean);
  const unique = [...new Set(words)].sort((a, b) => collator.compare(a, b));
  await writeFile(path, unique.join("\n") + "\n");
}

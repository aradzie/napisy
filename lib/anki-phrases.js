import { readFile } from "node:fs/promises";
import { parse } from "node:path";
import { findFiles } from "./io.js";

async function scanPhrases(notes) {
  for await (const file of findFiles("phrases", "**/*.txt")) {
    console.log(`Parsing a phrases file "${file}"`);
    const contents = await readFile(file, "utf-8");
    const { name } = parse(file);
    for (const line of contents.split("\n")) {
      if (line) {
        const [q, a] = line.split("|");
        if (q && a) {
          notes.push({
            type: `Basic`,
            deck: `Polski::Wyrażenia::${name}`,
            tags: `Polski Wyrażenie`,
            front: q,
            back: a,
          });
        } else {
          console.warn(`Invalid line "${line}" in file "${file}"`);
        }
      }
    }
  }
}

export { scanPhrases };

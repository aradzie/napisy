import { readFile } from "node:fs/promises";
import { findSentences } from "./lib/text.js";

await scanText("data/pg27178.txt");

async function scanText(file) {
  const text = await readFile(file, "utf-8");
  const segments = findSentences(text.replaceAll(/[\s\n]+/g, " "));
  for (const segment of segments) {
    if (/„|”|-|:|\.\.\.|Jezu/.test(segment)) {
      continue;
    }
    console.log("{" + segment + "}");
  }
}

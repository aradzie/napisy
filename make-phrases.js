import { writeFile } from "node:fs/promises";
import { parse } from "node:path";
import { translateText } from "./lib/deepl.js";
import { readSrt } from "./lib/srt-io.js";
import { findSentences } from "./lib/text.js";

await makePhrases("data/1670.S01E02.srt");

async function makePhrases(file) {
  const { name } = parse(file);
  const text = [...(await readSrt(file))].map(({ text }) => text).join(" ");
  const pairs = [];
  const segments = findSentences(text);
  for (const chunk of chunkArray(segments, 50)) {
    const translations = await translateText(chunk, "RU", "PL");
    pairs.push(...translations);
    await writeFile(`out/${name}.json`, JSON.stringify(pairs, null, 2));
  }
}

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

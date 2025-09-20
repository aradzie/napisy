import { readFile, writeFile } from "node:fs/promises";
import { pathTo, readLines } from "./lib/io.js";
import { findWords } from "./lib/text.js";

const interesting = new Set([
  "bierz", //
  "bierzcie",
  "bierzmy",
  "chciej",
  "chciejcie",
  "chciejmy",
]);

const dict = new Map();

const dictFile = pathTo("dict.json");

await process();

async function process() {
  await readDict();
  let count = 0;
  for await (const line of readLines(pathTo("corpus/corpus.txt"))) {
    addLine(line);
    count += 1;
    if (count % 1000000 === 0) {
      await writeDict();
      console.log(count);
    }
  }
  await writeDict();
  console.log(count);
}

function addLine(line) {
  const words = findWords(line);
  for (let word of words) {
    word = word.toLocaleLowerCase("pl");
    if (interesting.has(word)) {
      let list = dict.get(word);
      if (list == null) {
        dict.set(word, (list = new Set()));
      }
      list.add(line);
    }
  }
}

async function readDict() {
  let data = {};
  try {
    data = JSON.parse(await readFile(dictFile, "utf-8"));
  } catch {}
  for (const [word, list] of data) {
    dict.set(word, new Set(list));
  }
}

async function writeDict() {
  const collator = new Intl.Collator("pl", {
    sensitivity: "variant",
    caseFirst: "lower",
  });
  let data = [...dict].map(([word, list]) => [word, [...list]]);
  data = data.toSorted((a, b) => collator.compare(a[0], b[0]));
  data = data.map(([word, list]) => [word, list.toSorted((a, b) => collator.compare(a, b))]);
  await writeFile(dictFile, JSON.stringify(data, null, 2));
}

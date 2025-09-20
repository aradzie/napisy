import { writeFile } from "node:fs/promises";
import { Blacklist } from "./lib/blacklist.js";
import { findFiles, pathTo, readLines } from "./lib/io.js";
import { spellChecker } from "./lib/spell-checker.js";
import { Word } from "./lib/word.js";

const blacklist = await new Blacklist().addFiles(await Array.fromAsync(findFiles("corpus", "blacklist*.txt")));

const dict = new Map();

const lines = await Array.fromAsync(readLines(pathTo("corpus/corpus-lemmata.txt")));
for (const line of lines) {
  parsePhrase(line);
}

const items = [...dict.values()];
await dump(items, pathTo("freq-all.csv"));
await dump(
  items.filter(({ upos }) => upos === "VERB"),
  pathTo("freq-verb.csv"),
);
await dump(
  items.filter(({ upos }) => upos === "NOUN"),
  pathTo("freq-noun.csv"),
);
await dump(
  items.filter(({ upos }) => upos === "ADJ"),
  pathTo("freq-adj.csv"),
);
await dump(
  items.filter(({ upos }) => upos === "ADV"),
  pathTo("freq-adv.csv"),
);

function parsePhrase(line) {
  for (const word of Word.parseWords(line)) {
    const { lemma, form, upos } = word;
    switch (upos) {
      case "VERB":
      case "NOUN":
      case "PRON":
      case "ADJ":
      case "ADV": {
        if (!(blacklist.allow(lemma) && blacklist.allow(form))) {
          continue;
        }
        if (!lemma.includes("_") && !(spellChecker.has(lemma) && spellChecker.has(form))) {
          continue;
        }
        let item = dict.get(lemma);
        if (item == null) {
          dict.set(lemma, (item = { lemma, upos, count: 0 }));
        }
        item.count += 1;
        break;
      }
    }
  }
}

async function dump(items, path) {
  const collator = new Intl.Collator("pl", { sensitivity: "base" });
  const lines = [...items]
    .sort((a, b) => b.count - a.count || collator.compare(a.lemma, b.lemma))
    .map(({ lemma, upos, count }) => `${lemma},${upos},${count}`);
  console.log(`Writing ${items.length} lines to file ${path}`);
  await writeFile(path, lines.join("\n") + "\n");
}

import { writeFile } from "node:fs/promises";
import { pathTo, readLines } from "./lib/io.js";
import { Word } from "./lib/word.js";

const dict = new Map();

const lines = await Array.fromAsync(readLines(pathTo("corpus/corpus_lemmata.txt")));
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
    const { lemma, upos } = word;
    switch (upos) {
      case "VERB":
      case "NOUN":
      case "PRON":
      case "ADJ":
      case "ADV": {
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
  await writeFile(path, lines.join("\n") + "\n");
}

import { Blacklist } from "../lib/blacklist.js";
import { writeCsvFile } from "../lib/csv.js";
import { findFiles, pathTo, readLines } from "../lib/io.js";
import { Lemmata } from "../lib/lemmata.js";
import { Morpholog } from "../lib/morpholog.js";
import { collator } from "../lib/text.js";
import { Xext, Xpos } from "../lib/xtags.js";

const morpholog = await Morpholog.load();

const blacklist = await Blacklist.load();

const dict = new Map();

for await (const path of findFiles("corpus", "corpus*-lemmata.txt")) {
  console.log(`Reading a lemmata file "${path}"`);
  for await (const line of readLines(path)) {
    parsePhrase(line);
  }
}

const list = stats([...dict.values()]).filter(({ ppm }) => ppm >= 3);
await dump(
  list.filter(
    ({ pos }) =>
      pos !== "NUM" && //
      pos !== "AUX",
  ),
  pathTo("corpus/freq-all.csv"),
);
await dump(
  list.filter(
    ({ pos }) =>
      pos !== "ADJ" && //
      pos !== "ADV" &&
      pos !== "AUX" &&
      pos !== "NOUN" &&
      pos !== "NUM" &&
      pos !== "VERB",
  ),
  pathTo("corpus/freq-etc.csv"),
);

function parsePhrase(line) {
  for (const word of Lemmata.parseLine(line)) {
    let { lemma, form, pos } = word;

    if (blacklist.bad(lemma) || blacklist.bad(form)) {
      continue;
    }

    let verb = null;

    switch (pos) {
      case "NOUN": {
        if (lemma === "postać") {
          break;
        }
        // projektować -> projektowanie | ger:sg:nom.acc:n:imperf:aff
        const result = morpholog.find(lemma, Xpos.ger, Xext.sg | Xext.nom | Xext.aff);
        if (result.length > 0) {
          verb = lemma;
          lemma = result[0].form;
        }
        break;
      }
      case "ADJ": {
        let result;
        // stosować -> stosowany | ppas:sg:nom.voc:m1.m2.m3:imperf:aff
        result = morpholog.find(lemma, Xpos.ppas, Xext.sg | Xext.nom | Xext.m1 | Xext.m2 | Xext.m3 | Xext.aff);
        if (result.length > 0) {
          verb = lemma;
          lemma = result[0].form;
          break;
        }
        // dotyczyć -> dotyczący | pact:sg:nom.voc:m1.m2.m3:imperf:aff
        result = morpholog.find(lemma, Xpos.pact, Xext.sg | Xext.nom | Xext.m1 | Xext.m2 | Xext.m3 | Xext.aff);
        if (result.length > 0) {
          verb = lemma;
          lemma = result[0].form;
          break;
        }
        break;
      }
    }

    const key = `${pos}:${lemma}`;
    let entry = dict.get(key);
    if (entry == null) {
      dict.set(key, (entry = { lemma, pos, count: 0, ppm: 0, verb }));
    }
    entry.count += 1;
  }
}

function stats(items) {
  let count = 0;
  for (const item of items) {
    count += item.count;
  }
  for (const item of items) {
    item.ppm = Math.round((item.count / count) * 1_000_000);
  }
  return items;
}

async function dump(list, path) {
  const rows = [...list]
    .sort((a, b) => b.count - a.count || collator.compare(a.lemma, b.lemma))
    .map(({ lemma, pos, ppm, verb }) => (verb ? [lemma, pos, ppm, verb] : [lemma, pos, ppm]));
  console.log(`Writing ${rows.length} lines to file "${path}"`);
  await writeCsvFile(path, rows);
}

import { Blacklist } from "../lib/blacklist.js";
import { writeCsvFile } from "../lib/csv.js";
import { findFiles, pathTo, readLines } from "../lib/io.js";
import { Lemmata } from "../lib/lemmata.js";
import { collator } from "../lib/text.js";

const blacklist = await Blacklist.load();

const lemmaDict = new Map();
const formDict = new Map();

for await (const path of findFiles("corpus", "corpus*-lemmata.txt")) {
  console.log(`Reading a lemmata file "${path}"`);
  for await (const line of readLines(path)) {
    parsePhrase(line);
  }
}

const lemmas = stats([...lemmaDict.values()]).filter(({ ppm }) => ppm >= 1);
await dumpLemmas(
  lemmas.filter(({ pos }) => pos !== "NUM" && pos !== "AUX"),
  pathTo("corpus/freq.csv"),
);
await dumpLemmas(
  lemmas.filter(({ pos }) => pos === "ADJ"),
  pathTo("corpus/freq-adj.csv"),
);
await dumpLemmas(
  lemmas.filter(({ pos }) => pos === "ADV"),
  pathTo("corpus/freq-adv.csv"),
);
await dumpLemmas(
  lemmas.filter(({ pos }) => pos === "NOUN"),
  pathTo("corpus/freq-noun.csv"),
);
await dumpLemmas(
  lemmas.filter(({ pos }) => pos === "VERB"),
  pathTo("corpus/freq-verb.csv"),
);
await dumpLemmas(
  lemmas.filter(
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
await dumpLemmas(
  lemmas.filter(({ pos }) => pos === "ADP"),
  pathTo("corpus/freq-etc-adp.csv"),
);
await dumpLemmas(
  lemmas.filter(({ pos }) => pos === "CONJ" || pos === "CCONJ" || pos === "SCONJ"),
  pathTo("corpus/freq-etc-conj.csv"),
);
await dumpLemmas(
  lemmas.filter(({ pos }) => pos === "DET"),
  pathTo("corpus/freq-etc-det.csv"),
);
await dumpLemmas(
  lemmas.filter(({ pos }) => pos === "PART"),
  pathTo("corpus/freq-etc-part.csv"),
);
await dumpLemmas(
  lemmas.filter(({ pos }) => pos === "PRON"),
  pathTo("corpus/freq-etc-pron.csv"),
);

const forms = stats([...formDict.values()]).filter(({ ppm }) => ppm >= 3);
await dumpForms(forms, pathTo("corpus/freq-raw.csv"));

function parsePhrase(line) {
  for (const word of Lemmata.parseLine(line)) {
    let { lemma, form, pos } = word;

    lemma = canonical(lemma);
    form = canonical(form);

    if (blacklist.bad(lemma) || blacklist.bad(form)) {
      continue;
    }

    let lemmaItem = lemmaDict.get(lemma);
    if (lemmaItem == null) {
      lemmaDict.set(lemma, (lemmaItem = { lemma, pos, count: 0, ppm: 0 }));
    }
    lemmaItem.count += 1;

    let formItem = formDict.get(form);
    if (formItem == null) {
      formDict.set(form, (formItem = { form, lemma, pos, count: 0, ppm: 0 }));
    }
    formItem.count += 1;
  }
}

function canonical(word) {
  return word;
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

async function dumpLemmas(items, path) {
  const rows = [...items]
    .sort((a, b) => b.count - a.count || collator.compare(a.lemma, b.lemma))
    .map(({ lemma, pos, ppm }) => [lemma, pos, ppm]);
  console.log(`Writing ${rows.length} lines to file "${path}"`);
  await writeCsvFile(path, rows);
}

async function dumpForms(items, path) {
  const rows = [...items]
    .sort((a, b) => b.count - a.count || collator.compare(a.form, b.form))
    .map(({ form, lemma, pos, ppm }) => [form, lemma, pos, ppm]);
  console.log(`Writing ${rows.length} lines to file "${path}"`);
  await writeCsvFile(path, rows);
}

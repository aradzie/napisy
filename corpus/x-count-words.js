import { Blacklist } from "../lib/blacklist.js";
import { writeCsvFile } from "../lib/csv.js";
import { findFiles, pathTo, readLines } from "../lib/io.js";
import { collator } from "../lib/text.js";
import { Word } from "../lib/word.js";

const blacklist = await Blacklist.load();

const lemmaDict = new Map();
const formDict = new Map();

for await (const path of findFiles("corpus", "corpus*-lemmata.txt")) {
  console.log(`Reading lemmata file ${path}`);
  for await (const line of readLines(path)) {
    parsePhrase(line);
  }
}

const lemmas = stats([...lemmaDict.values()]).filter(({ ppm }) => ppm >= 1);
await dumpLemmas(
  lemmas.filter(({ upos }) => upos !== "NUM" && upos !== "AUX"),
  pathTo("corpus/freq.csv"),
);
await dumpLemmas(
  lemmas.filter(({ upos }) => upos === "ADJ"),
  pathTo("corpus/freq-adj.csv"),
);
await dumpLemmas(
  lemmas.filter(({ upos }) => upos === "ADV"),
  pathTo("corpus/freq-adv.csv"),
);
await dumpLemmas(
  lemmas.filter(({ upos }) => upos === "NOUN"),
  pathTo("corpus/freq-noun.csv"),
);
await dumpLemmas(
  lemmas.filter(({ upos }) => upos === "VERB"),
  pathTo("corpus/freq-verb.csv"),
);
await dumpLemmas(
  lemmas.filter(
    ({ upos }) =>
      upos !== "ADJ" && //
      upos !== "ADV" &&
      upos !== "AUX" &&
      upos !== "NOUN" &&
      upos !== "NUM" &&
      upos !== "VERB",
  ),
  pathTo("corpus/freq-etc.csv"),
);
await dumpLemmas(
  lemmas.filter(({ upos }) => upos === "ADP"),
  pathTo("corpus/freq-etc-adp.csv"),
);
await dumpLemmas(
  lemmas.filter(({ upos }) => upos === "CONJ" || upos === "CCONJ" || upos === "SCONJ"),
  pathTo("corpus/freq-etc-conj.csv"),
);
await dumpLemmas(
  lemmas.filter(({ upos }) => upos === "DET"),
  pathTo("corpus/freq-etc-det.csv"),
);
await dumpLemmas(
  lemmas.filter(({ upos }) => upos === "PART"),
  pathTo("corpus/freq-etc-part.csv"),
);
await dumpLemmas(
  lemmas.filter(({ upos }) => upos === "PRON"),
  pathTo("corpus/freq-etc-pron.csv"),
);

const forms = stats([...formDict.values()]).filter(({ ppm }) => ppm >= 3);
await dumpForms(forms, pathTo("corpus/freq-raw.csv"));

function parsePhrase(line) {
  for (const word of Word.parseWords(line)) {
    let { lemma, form, upos } = word;

    lemma = canonical(lemma);
    form = canonical(form);

    if (blacklist.bad(lemma) || blacklist.bad(form)) {
      continue;
    }

    let lemmaItem = lemmaDict.get(lemma);
    if (lemmaItem == null) {
      lemmaDict.set(lemma, (lemmaItem = { lemma, upos, count: 0, ppm: 0 }));
    }
    lemmaItem.count += 1;

    let formItem = formDict.get(form);
    if (formItem == null) {
      formDict.set(form, (formItem = { form, lemma, upos, count: 0, ppm: 0 }));
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
    .map(({ lemma, upos, ppm }) => [lemma, upos, ppm]);
  console.log(`Writing ${rows.length} lines to file ${path}`);
  await writeCsvFile(path, rows);
}

async function dumpForms(items, path) {
  const rows = [...items]
    .sort((a, b) => b.count - a.count || collator.compare(a.form, b.form))
    .map(({ form, lemma, upos, ppm }) => [form, lemma, upos, ppm]);
  console.log(`Writing ${rows.length} lines to file ${path}`);
  await writeCsvFile(path, rows);
}

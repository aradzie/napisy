import { XMLParser } from "fast-xml-parser";
import { readFile, writeFile } from "node:fs/promises";
import { readCsvFile } from "../lib/csv.js";
import { pathTo } from "../lib/io.js";
import { collator } from "../lib/text.js";

const entries = [];

const good = new Set((await readCsvFile(pathTo("corpus/freq.csv"))).map(([word]) => word));

parseTei(await readFile(pathTo("corpus/pol-rus.tei"), "utf-8"));

await writeFile(pathTo("corpus/pol-rus.txt"), formatText());

function parseTei(xml) {
  const { TEI } = new XMLParser().parse(xml);
  for (const entry of TEI.text.body.entry) {
    const word = entry.form.orth;
    if (good.has(word)) {
      switch (entry.gramGrp?.pos) {
        // pos: idiom
        // pos: proverb
        case "v":
        case "modal": {
          entries.push(["VERB", word, convEntry(entry)]);
          break;
        }
        case "n": {
          entries.push(["NOUN", word, convEntry(entry)]);
          break;
        }
        case "adj":
        case "participleAdjective":
        case "possessiveAdjective": {
          entries.push(["ADJ", word, convEntry(entry)]);
          break;
        }
        case "adv": {
          entries.push(["ADV", word, convEntry(entry)]);
          break;
        }
        case "pronoun":
        case "personalPronoun":
        case "indefinitePronoun":
        case "interrogativePronoun": {
          entries.push(["PRON", word, convEntry(entry)]);
          break;
        }
        case "preposition": {
          break;
        }
        case "conjunction": {
          break;
        }
        case "particle": {
          break;
        }
        case "indefiniteCardinalNumeral": {
          break;
        }
      }
    }
  }
}

function convEntry({ sense }) {
  const trans = [];
  if (Array.isArray(sense)) {
    for (const item of sense) {
      trans.push([convCit(item), convSense(item)]);
    }
  } else {
    trans.push([convCit(sense), convSense(sense)]);
  }
  return trans;
}

function convCit({ cit }) {
  if (Array.isArray(cit.quote)) {
    return cit.quote.map((v) => normalize(v));
  } else {
    return [normalize(cit.quote)];
  }
}

function convSense({ sense }) {
  if (Array.isArray(sense)) {
    return sense.map(({ def }) => def);
  } else {
    return [sense.def];
  }
}

function normalize(v) {
  // Unicode Character “◌́” (U+0301)
  // Combining Acute Accent
  return v.replace(/\u0301/g, "");
}

function formatText() {
  entries.sort((a, b) => collator.compare(a[0], b[0]));
  const lines = [];
  for (const [pos, word, trans] of entries) {
    if (lines.length > 0) {
      lines.push(``);
    }
    lines.push(`${word} ${pos}`);
    for (const [words, defs] of trans) {
      lines.push(`  ${words.join(", ")}`);
      for (const def of defs) {
        lines.push(`    ${def}`);
      }
    }
  }
  return lines.join("\n") + "\n";
}

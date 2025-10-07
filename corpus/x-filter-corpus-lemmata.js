import { Blacklist } from "../lib/blacklist.js";
import { pathTo } from "../lib/io.js";
import { Lemmata } from "../lib/lemmata.js";
import { processCorpus } from "./x-util.js";

const blacklist = await Blacklist.load();

function checkLine(line) {
  const words = Lemmata.parseLine(line);
  for (const word of words) {
    if (word.pos !== "AUX" && word.pos !== "PUNCT" && blacklist.bad(word.form)) {
      return false;
    }
  }
  return true;
}

await processCorpus(pathTo("corpus/corpus1-lemmata.txt"), checkLine);
await processCorpus(pathTo("corpus/corpus2-lemmata.txt"), checkLine);
await processCorpus(pathTo("corpus/corpus3-lemmata.txt"), checkLine);

import { Blacklist } from "../lib/blacklist.js";
import { pathTo } from "../lib/io.js";
import { processCorpus } from "./x-util.js";

const blacklist = await Blacklist.load();

function checkLine(line) {
  if (line.length < 15) {
    return false;
  }
  const words = line.split(/[- .,!?]+/g).filter(Boolean);
  if (
    words.length < 3 ||
    (/^(A|A co|Ach|Ale|Aj|Bo|Czy|Dla|I|Jak|K|Ku|Nie|No|O|Ta|Tą|Te|Tę|Tacy|To|U|W|Z|Za|Że)[ ,]/.test(line) &&
      words.length < 4)
  ) {
    return false;
  }
  for (const word of words) {
    if (blacklist.bad(word)) {
      return false;
    }
  }
  return true;
}

await processCorpus(pathTo("corpus/corpus1.txt"), checkLine);
await processCorpus(pathTo("corpus/corpus2.txt"), checkLine);
await processCorpus(pathTo("corpus/corpus3.txt"), checkLine);

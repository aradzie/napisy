import { pathTo } from "../lib/io.js";
import { LargeSet, processCorpus } from "./x-util.js";

const seen = new LargeSet();

function checkLine(line) {
  const key = line
    .split(/[- .,!?]+/g)
    .join("")
    .toLocaleLowerCase("pl");
  if (seen.has(key)) {
    return false;
  } else {
    seen.add(key);
    return true;
  }
}

await processCorpus(pathTo("corpus/corpus1.txt"), checkLine);

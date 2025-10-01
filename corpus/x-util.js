import { createWriteStream } from "node:fs";
import { format, parse } from "node:path";
import { readLines } from "../lib/io.js";

export class LargeSet {
  #data = new Map();

  has(key) {
    const s = key.substring(0, 3);
    let set = this.#data.get(s);
    if (set == null) {
      this.#data.set(s, (set = new Set()));
    }
    return set.has(key);
  }

  add(key) {
    const s = key.substring(0, 3);
    let set = this.#data.get(s);
    if (set == null) {
      this.#data.set(s, (set = new Set()));
    }
    set.add(key);
    return this;
  }
}

export class Progress {
  #count;
  #started;
  #now;

  constructor() {
    this.#count = 0;
    this.#started = this.#now = performance.now();
  }

  bump() {
    this.#count += 1;
    this.#now = performance.now();
  }

  get count() {
    return this.#count;
  }

  get elapsed() {
    return (this.#now - this.#started) / 1000;
  }

  get rate() {
    const elapsed = (this.#now - this.#started) / 1000;
    if (elapsed > 0) {
      return this.#count / elapsed;
    } else {
      return 0;
    }
  }
}

export async function processCorpus(inputPath, checkLine) {
  const { root, dir, name, ext } = parse(inputPath);
  const goodPath = format({ root, dir, name: name + "-good", ext });
  const badPath = format({ root, dir, name: name + "-bad", ext });

  await using goodFile = createWriteStream(goodPath, { flags: "w" });
  await using badFile = createWriteStream(badPath, { flags: "w" });

  const prog = new Progress();
  for await (const line of readLines(inputPath)) {
    if (checkLine(line)) {
      goodFile.write(line);
      goodFile.write("\n");
    } else {
      badFile.write(line);
      badFile.write("\n");
    }
    prog.bump();
    if (prog.count % 100000 === 0) {
      log();
    }
  }
  log();

  function log() {
    const elapsed = prog.elapsed.toFixed(2);
    const rate = prog.rate.toFixed(2);
    console.log(`Checked ${prog.count} lines in ${elapsed} seconds, ${rate} lines/second`);
  }
}

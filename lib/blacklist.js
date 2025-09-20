import dictionary from "dictionary-pl";
import { readFile } from "node:fs/promises";
import NSpell from "nspell";
import { findFiles, pathTo } from "./io.js";

const nspell = new NSpell(dictionary);

export class Blacklist {
  static async findFiles() {
    return await Array.fromAsync(findFiles("corpus", "blacklist*.txt"));
  }

  static async load() {
    return await new Blacklist().addFiles(await this.findFiles());
  }

  #bad = new Set();
  #good = new Set();
  #prefixes = new Map();

  add(...args) {
    for (const arg of args) {
      if (Array.isArray(arg)) {
        for (const item of arg) {
          this.add(item);
        }
      } else if (arg.length > 0) {
        const stem = this.#stem(arg.normalize("NFC"));
        if (stem.endsWith("*")) {
          const prefix = stem.substring(0, stem.length - 1);
          const key = this.#getKey(stem);
          let prefixes = this.#prefixes.get(key);
          if (prefixes == null) {
            this.#prefixes.set(key, (prefixes = new Set()));
          }
          prefixes.add(prefix);
        } else {
          this.#bad.add(stem);
        }
      }
    }
    return this;
  }

  async addFiles(...args) {
    for (const arg of args) {
      if (Array.isArray(arg)) {
        for (const item of arg) {
          await this.addFiles(item);
        }
      } else {
        const file = pathTo(arg);
        console.log(`Adding blacklist file ${file}`);
        const text = await readFile(file, "utf-8");
        const words = text.split(/\s+/g);
        this.add(words);
      }
    }

    return this;
  }

  good(word) {
    return !this.bad(word);
  }

  bad(word) {
    const stem = this.#stem(word);
    if (stem.length > 1 && !/[aąeęijoóuy]/.test(stem)) {
      return false;
    }
    if (this.#bad.has(stem)) {
      return true;
    }
    if (this.#good.has(stem)) {
      return false;
    }
    const key = this.#getKey(stem);
    const prefixes = this.#prefixes.get(key);
    if (prefixes != null) {
      for (const prefix of prefixes) {
        if (stem.startsWith(prefix)) {
          this.#bad.add(stem);
          return true;
        }
      }
    }
    if (nspell.correct(stem)) {
      this.#good.add(stem);
      return false;
    } else {
      this.#bad.add(stem);
      return true;
    }
  }

  #stem(word) {
    return word.toLocaleLowerCase("pl");
  }

  #getKey(word) {
    return word.substring(0, 2);
  }
}

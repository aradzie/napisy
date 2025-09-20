import { readFile } from "node:fs/promises";
import { pathTo } from "./io.js";

export class Blacklist {
  #words = new Set();

  add(...args) {
    for (const arg of args) {
      if (Array.isArray(arg)) {
        for (const item of arg) {
          this.add(item);
        }
      } else if (arg.length > 0) {
        this.#words.add(arg);
        this.#words.add(this.#stem(arg));
      }
    }
    return this;
  }

  delete(...args) {
    for (const arg of args) {
      if (Array.isArray(arg)) {
        for (const item of arg) {
          this.delete(item);
        }
      } else if (arg.length > 0) {
        this.#words.delete(arg);
        this.#words.delete(this.#stem(arg));
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

  allow(word) {
    return !this.forbid(word);
  }

  forbid(word) {
    return this.#words.has(word) || this.#words.has(this.#stem(word));
  }

  #stem(word) {
    return word.toLocaleLowerCase("pl");
  }

  *[Symbol.iterator]() {
    for (const word of this.#words) {
      yield word;
    }
  }
}

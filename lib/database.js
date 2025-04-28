import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, parse } from "node:path";
import { pathTo } from "./io.js";

const historyFile = pathTo(homedir(), ".local", "state", "napisy", "history.json");

class Database {
  static async open(files) {
    const database = new Database();
    await database.#readHistory();
    for (const file of files) {
      const { ext } = parse(file);
      const contents = await readFile(pathTo(file), "utf-8");
      let items = [];
      switch (ext) {
        case ".json":
          items = JSON.parse(contents);
          break;
        case ".txt":
          for (const line of contents.split("\n")) {
            const [q, a] = line.split("|").map((s) => s.trim());
            if (a && q) {
              items.push([a, q]);
            }
          }
          break;
      }
      for (const [a, q] of items) {
        database.#add(new Item(a, q));
      }
    }
    return database;
  }

  #history = new History({});
  #items = new Map();

  async #readHistory() {
    await mkdir(dirname(historyFile), { recursive: true });
    let json = {};
    try {
      json = JSON.parse(await readFile(historyFile, "utf-8"));
    } catch (ex) {
      if (ex.code !== "ENOENT") {
        throw ex;
      }
    }
    this.#history = new History(json);
  }

  async #writeHistory() {
    await mkdir(dirname(historyFile), { recursive: true });
    await writeFile(historyFile, JSON.stringify(this.#history, null, 2));
  }

  #add(item) {
    this.#items.set(item.hash, item);
  }

  pickItem() {
    return pickOne([...this.#items.values()]);
  }

  async updateItem(item, level) {
    this.#history.update(item, level);
    await this.#writeHistory();
  }
}

class Item {
  #a;
  #q;
  #hash;

  constructor(a, q) {
    this.#a = a;
    this.#q = q;
    this.#hash = hashOf(a);
  }

  get a() {
    return this.#a;
  }

  get q() {
    return this.#q;
  }

  get hash() {
    return this.#hash;
  }
}

class History {
  #data = new Map();

  constructor(json) {
    for (const [hash, list] of Object.entries(json)) {
      this.#data.set(
        hash, //
        list.map(([time, level]) => ({ time, level })),
      );
    }
  }

  update(item, level) {
    let list = this.#data.get(item.hash);
    if (list == null) {
      this.#data.set(item.hash, (list = []));
    }
    list.push({ time: Date.now(), level });
  }

  toJSON() {
    return Object.fromEntries(
      [...this.#data].map(([hash, list]) => [
        hash, //
        list.map(({ time, level }) => [time, level]),
      ]),
    );
  }
}

function hashOf(value) {
  return createHash("sha1").update(value).digest("hex").substring(0, 16);
}

function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export { Database, Item };

import { createReadStream } from "node:fs";
import { glob } from "node:fs/promises";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { createGunzip } from "node:zlib";

export function pathTo(...file) {
  return resolve(import.meta.dirname, "..", ...file);
}

export async function* findFiles(base, pattern) {
  for await (const item of glob(pattern, { cwd: pathTo(base) })) {
    yield pathTo(base, item);
  }
}

export async function* readLines(path) {
  const input = createReadStream(path);
  const readLines = createInterface({
    input: path.endsWith(".gz") ? input.pipe(createGunzip()) : input,
    crlfDelay: Infinity,
  });
  for await (let line of readLines) {
    line = line.trim().normalize("NFC");
    if (line.length > 0) {
      yield line;
    }
  }
}

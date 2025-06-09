import { createReadStream } from "node:fs";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { createGunzip } from "node:zlib";

function pathTo(...file) {
  return resolve(dirname(fileURLToPath(import.meta.url)), "..", ...file);
}

async function* readLines(file) {
  const input = createReadStream(file);
  const readLines = createInterface({
    input: file.endsWith(".gz") ? input.pipe(createGunzip()) : input,
    crlfDelay: Infinity,
  });
  for await (let line of readLines) {
    line = line.trim().normalize("NFC");
    if (line.length > 0) {
      yield line;
    }
  }
}

export { pathTo, readLines };

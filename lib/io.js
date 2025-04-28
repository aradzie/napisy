import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function pathTo(...file) {
  return resolve(dirname(fileURLToPath(import.meta.url)), "..", ...file);
}

export { pathTo };

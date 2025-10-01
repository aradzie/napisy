import { readFile, writeFile } from "node:fs/promises";

export async function readCsvFile(path) {
  return parseCsv(await readFile(path, "utf-8"));
}

export async function writeCsvFile(path, rows, separator = ",") {
  await writeFile(path, rows.map((row) => row.join(separator)).join("\n") + "\n");
}

export function parseCsv(text, separator = ",") {
  const rows = [];
  for (const line of text.split("\n")) {
    rows.push(line.split(separator));
  }
  return rows;
}

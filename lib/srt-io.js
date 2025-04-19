import { readFile } from "node:fs/promises";
import { parseSrt } from "./srt-parse.js";

export async function readSrt(file) {
  return parseSrt(await readFile(file, "utf-8"));
}

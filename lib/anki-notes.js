import { marked } from "marked";
import { readFile } from "node:fs/promises";
import { findFiles } from "./io.js";

async function scanNotes(notes) {
  for await (const file of findFiles("notes", "**/*.txt")) {
    console.log(`Parsing a notes file "${file}"`);
    const contents = await readFile(file, "utf-8");
    await parseFile(contents, notes);
  }
}

async function parseFile(text, notes) {
  let type = "Basic";
  let deck = "";
  let tags = "";

  let state = "front";

  let front = "";
  let back = "";

  for (let line of text.split(/\n/g)) {
    if (line.startsWith("!#")) {
      continue;
    }
    if (line.startsWith("!type:")) {
      type = line.substring(6).trim();
      continue;
    }
    if (line.startsWith("!deck:")) {
      deck = line.substring(6).trim();
      continue;
    }
    if (line.startsWith("!tags:")) {
      tags = line.substring(6).trim();
      continue;
    }
    if (line.startsWith("---")) {
      state = "back";
      continue;
    }
    if (line.startsWith("===")) {
      front = front.trim();
      back = marked.parse(back.trim(), {}).trim();
      notes.push({ type, deck, tags, front, back });
      state = "front";
      front = "";
      back = "";
      continue;
    }
    switch (state) {
      case "front":
        if (front) {
          front += "\n";
        }
        front += line;
        break;
      case "back":
        if (back) {
          back += "\n";
        }
        back += line;
        break;
    }
  }
}

export { scanNotes };

/**
 * A script that processes the input text files and compiles the output deck file.
 * The input files are formatted in a user-readable form.
 * The output file can be imported in Anki.
 */

import { glob, readFile, writeFile } from "node:fs/promises";
import { parse } from "node:path";
import { formatNotes } from "./lib/anki.js";
import { pathTo } from "./lib/io.js";

const notes = [];

await scanPhrases(notes);
await scanNotes(notes);
await writeNotes(notes, pathTo("_notes.txt"));

async function scanPhrases(notes) {
  for await (const file of glob(`**/*.txt`, {
    cwd: pathTo("phrases"),
  })) {
    const { dir, name } = parse(file);
    const inputFile = pathTo(`phrases/${dir}/${name}.txt`);
    console.log(`Parsing file "${inputFile}"`);
    const contents = await readFile(inputFile, "utf-8");
    for (const line of contents.split("\n")) {
      if (line) {
        const [q, a] = line.split("|");
        if (q && a) {
          notes.push({
            type: `Basic`,
            deck: `Polski::Frazy::${name}`,
            tags: `Polski ${name}`,
            front: q,
            back: a,
          });
        } else {
          console.warn(`Invalid line "${line}" in file "${inputFile}"`);
        }
      }
    }
  }
}

async function scanNotes(notes) {
  for await (const file of glob("**/*.txt", {
    cwd: pathTo("notes"),
  })) {
    const { dir, name } = parse(file);
    const inputFile = pathTo(`notes/${dir}/${name}.txt`);
    console.log(`Parsing file "${inputFile}"`);
    const contents = await readFile(inputFile, "utf-8");
    await parseFile(contents, notes);
  }
}

async function writeNotes(notes, deckFile) {
  console.log(`Parsed ${notes.length} note(s)`);
  console.log(`Writing file "${deckFile}"`);
  await writeFile(deckFile, formatNotes(notes));
}

async function parseFile(text, notes) {
  let type = "Basic";
  let deck = "";
  let tags = "";

  let state = "front";

  let front = "";
  let back = "";

  for (let line of text.split(/\n/g)) {
    if (line.startsWith("#")) {
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
      notes.push({ type, deck, tags, front, back });
      state = "front";
      front = "";
      back = "";
      continue;
    }
    if (line) {
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
}

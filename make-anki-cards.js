import { writeFile } from "node:fs/promises";
import { scanNotes } from "./lib/anki-notes.js";
import { scanPhrases } from "./lib/anki-phrases.js";
import { formatNotes } from "./lib/anki.js";
import { generateExamples } from "./lib/gen/gen.js";
import { pathTo } from "./lib/io.js";

const notes = [];
await scanPhrases(notes);
await scanNotes(notes);
await generateExamples(notes);
await writeNotes(notes, pathTo("_notes.txt"));

async function writeNotes(notes, deckFile) {
  console.log(`Parsed ${notes.length} note(s)`);
  console.log(`Writing file "${deckFile}"`);
  await writeFile(deckFile, formatNotes(notes));
}

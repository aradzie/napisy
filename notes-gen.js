import { formatNotes, NoteList } from "@anotes/core";
import { writeFile } from "node:fs/promises";
import { generateExamples } from "./lib/gen/gen.js";
import { pathTo } from "./lib/io.js";

const notes = new NoteList();
await generateExamples(notes);
const file = pathTo("notes/odmiany/rzeczowniki.note");
console.log(`Generated ${notes.length} note(s) to file "${file}"`);
await writeFile(file, formatNotes(notes));

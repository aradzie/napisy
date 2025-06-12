function formatNotes(notes) {
  const lines = [];
  lines.push(`#separator:semicolon`);
  lines.push(`#html:true`);
  lines.push(`#notetype column:1`);
  lines.push(`#deck column:2`);
  lines.push(`#tags column:3`);
  for (const { type, deck, tags, front, back } of notes) {
    lines.push([type, deck, tags, front, back].map(formatField).join(";"));
  }
  lines.push("");
  return lines.join("\n");
}

function formatField(value) {
  if (value.includes(";") || value.includes("\n") || value.includes('"')) {
    return `"${value.replaceAll('"', '""')}"`;
  } else {
    return value;
  }
}

export { formatNotes };

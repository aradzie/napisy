export function printPairs(pairs) {
  const lines = [];
  for (const [a, b] of pairs) {
    lines.push(`${a.text}`);
    lines.push(`${b.text}`);
    lines.push("");
  }
  return lines.join("\n");
}

export function printDict(dict) {
  const lines = [];
  const words = [...dict.keys()].sort();
  for (const word of words) {
    lines.push(word);
    const items = dict.get(word);
    for (const item of items) {
      lines.push(`    ${item.text}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

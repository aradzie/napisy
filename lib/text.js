const collator = new Intl.Collator("pl", {
  sensitivity: "base",
});
const words = new Intl.Segmenter("pl", { granularity: "word" });
const sentences = new Intl.Segmenter("pl", { granularity: "sentence" });

function findWords(text) {
  const segments = [];
  for (const { segment } of words.segment(text)) {
    segments.push(segment.trim());
  }
  return segments;
}

function findSentences(text) {
  const segments = [];
  for (const { segment } of sentences.segment(text)) {
    segments.push(segment.trim());
  }
  return segments;
}

function capitalize(str) {
  return str.substring(0, 1).toLocaleUpperCase("pl") + str.substring(1);
}

export { collator, findWords, findSentences, capitalize };

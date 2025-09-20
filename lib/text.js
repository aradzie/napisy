const words = new Intl.Segmenter("pl", { granularity: "word" });
const sentences = new Intl.Segmenter("pl", { granularity: "sentence" });

function capitalize(str) {
  return str.substring(0, 1).toLocaleUpperCase("pl") + str.substring(1);
}

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

export { capitalize, findWords, findSentences };

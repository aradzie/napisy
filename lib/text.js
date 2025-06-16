const words = new Intl.Segmenter("pl", { granularity: "word" });
const sentences = new Intl.Segmenter("pl", { granularity: "sentence" });

function capitalize(str) {
  return str.substring(0, 1).toLocaleUpperCase("pl") + str.substring(1);
}

function findWords(text) {
  const words = [];
  const re = /\p{L}+('\p{L}+)?/gu;
  let m;
  while ((m = re.exec(text)) != null) {
    words.push(m[0]);
  }
  return words;
}

function findSentences(text) {
  const segments = [];
  for (const { segment } of sentences.segment(text)) {
    segments.push(segment.trim());
  }
  return segments;
}

export { capitalize, findWords, findSentences };

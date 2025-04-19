export function findWords(text, locale = "pl") {
  const words = [];
  const re = /\p{L}+('\p{L}+)?/gu;
  let m;
  while ((m = re.exec(text)) != null) {
    words.push(m[0].toLocaleLowerCase(locale));
  }
  return words;
}

export function findSentences(text, locale = "pl") {
  const segments = [];
  const segmenter = new Intl.Segmenter(locale, { granularity: "sentence" });
  for (const { segment } of segmenter.segment(text)) {
    segments.push(segment.trim());
  }
  return segments;
}

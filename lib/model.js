import { findWords } from "./text.js";

export function makeDictionary(items, stopList) {
  const map = new Map();
  for (const item of items) {
    for (const word of findWords(item.text)) {
      if (word.length > 1 && !stopList.has(word)) {
        let list = map.get(word);
        if (list == null) {
          map.set(word, (list = []));
        }
        list.push(item);
      }
    }
  }
  return map;
}

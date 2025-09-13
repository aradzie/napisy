import json

import stanza


def read_lines(filename):
    lines = []
    with open(filename, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            lines.append(line.rstrip("\n"))
    return lines


phrases = []
nlp = stanza.Pipeline("pl")
for line in read_lines("corpus/corpus1000.txt"):
    doc = nlp(line)
    phrase = []
    for word in doc.iter_words():
        phrase.append(
            {
                "text": word.text.lower(),
                "lemma": word.lemma.lower(),
                "upos": word.upos,
                "xpos": word.xpos,
            }
        )
    phrases.append(phrase)
with open("phrases.json", "w", encoding="utf-8") as f:
    json.dump(phrases, f, ensure_ascii=False, indent=2)

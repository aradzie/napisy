import stanza


nlp = stanza.Pipeline("pl", device=0)


def lemmatize(line):
    parts = []
    for word in nlp(line).iter_words():
        parts.append(
            f"{word.text.lower()}/{word.lemma.lower()}/{word.upos}/{word.xpos}"
        )
    return "|".join(parts)


def process_file(input_path, output_path, transform):
    count = 0
    with (
        open(input_path, "r", encoding="utf-8") as input_file,
        open(output_path, "w", encoding="utf-8") as output_file,
    ):
        for line in input_file:
            line = transform(line.strip())
            output_file.write(line + "\n")
            count += 1
            if count % 1000000 == 0:
                print(f"Processed {count} lines")


process_file("corpus/corpus.txt", "corpus/corpus-lemmata-x.txt", lemmatize)

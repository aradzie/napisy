import time

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
    with (
        open(input_path, "r", encoding="utf-8") as input_file,
        open(output_path, "w", encoding="utf-8") as output_file,
    ):
        count = 0
        start = time.perf_counter()
        for line in input_file:
            count += 1
            if count == 200000:
                break
            if count >= 100000:
                line = transform(line.strip())
                output_file.write(line + "\n")
                if count % 100 == 0:
                    end = time.perf_counter()
                    elapsed = end - start
                    rate = (count - 100000) / elapsed
                    print(
                        f"Processed {count} lines in {elapsed:.3f}s ({rate:.2f} items/sec)"
                    )


process_file("corpus/corpus.txt", "corpus/corpus-lemmata-b.txt", lemmatize)

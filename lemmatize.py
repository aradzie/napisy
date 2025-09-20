import time
from datetime import datetime

import stanza

from_line = 1
to_line = 300_000

nlp = stanza.Pipeline("pl", download_method=None)


def lemmatize(line):
    parts = []
    for word in nlp(line).iter_words():
        parts.append(
            f"{word.text.lower()}/{word.lemma.lower()}/{word.upos}/{word.xpos}"
        )
    return "|".join(parts)


def process_file(
    input_path,
    output_path,
):
    with (
        open(input_path, "r", encoding="utf-8") as input_file,
        open(output_path, "w", encoding="utf-8") as output_file,
    ):
        count = 0
        t_start = time.perf_counter()
        for line in input_file:
            count += 1
            if count == to_line:
                break
            if count >= from_line:
                line = lemmatize(line.strip())
                output_file.write(line + "\n")
                if count % 100 == 0:
                    t_end = time.perf_counter()
                    t_elapsed = t_end - t_start
                    rate = (count - from_line) / t_elapsed
                    remaining = (to_line - count) / rate / 60
                    print(
                        f"{datetime.now():%Y-%m-%d %H:%M:%S} "
                        f"processed {count} lines in {t_elapsed:.3f}s "
                        f"({rate:.2f} lines per second, "
                        f"{remaining:.0f} minutes remaining)",
                        flush=True,
                    )


process_file(
    "corpus/corpus.txt",
    "corpus/corpus-lemmata-x.txt",
)

import re

blocked_words = set()

for path in [
    "corpus/blacklist-profanity.txt",
    "corpus/blacklist-sensitive.txt",
    "corpus/blacklist-wulg.txt",
    "corpus/blacklist-names.txt",
]:
    with open(path, "r", encoding="utf-8") as blacklist_file:
        blocked_words.update({line.strip() for line in blacklist_file if line.strip()})

splitter = re.compile(r"\W+")
count = 0
with (
    open("corpus/corpus.txt", "r", encoding="utf-8") as input_file,
    open("corpus/corpus-filtered.txt", "w", encoding="utf-8") as output_file,
    open("corpus/corpus-blocked.txt", "w", encoding="utf-8") as blocked_file,
):
    for line in input_file:
        words = splitter.split(line.strip().lower())
        if any(word in blocked_words for word in words):
            blocked_file.write(line)
        else:
            output_file.write(line)
        count += 1
        if count % 1000000 == 0:
            print(f"Processed {count} lines")

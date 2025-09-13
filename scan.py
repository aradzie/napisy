import morfeusz2

from util import Znacznik

morf = morfeusz2.Morfeusz()

count = 0
with open('corpus/corpus-pl.txt', 'r') as file:
  for line in file:
    line = line.strip()
    print(f"line: '{line}'")
    for (i, j, x) in morf.analyse(line):
      (segment, lemat, znacznik, pospolitość, kwalifikatory) = x
      z = Znacznik.parse(znacznik)
      if z.is_verb:
        print(i, j, f"segment: '{segment}', lemat: '{lemat}', znacznik: [{znacznik}]")
    count += 1
    if count == 100:
      break

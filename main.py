import morfeusz2

kw = [
  "aff",
  "pact",
  "fin",
  "ger",
  "imperf",
  "n",
  "pl",
  "praet",
  "sg",
]

morf = morfeusz2.Morfeusz()


def parse_token_string(token_string, dictionary):
  result = {token: False for token in dictionary}

  if not token_string:
    return result

  for token in token_string.split(':'):
    if token in dictionary:
      result[token] = True

  return result


for (forma, lemat, znacznik, _, _) in morf.generate(u'miąć'):
  x = parse_token_string(znacznik, kw)
  if x["fin"] and x["imperf"]:
    print(forma, znacznik)

for (forma, lemat, znacznik, _, _) in morf.generate(u'miąć'):
  x = parse_token_string(znacznik, kw)
  if not (x["fin"] and x["imperf"]):
    print('>>>', forma, znacznik)

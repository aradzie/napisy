import morfeusz2

from util import Znacznik

morf = morfeusz2.Morfeusz()

for (forma, lemat, znacznik, _, _) in morf.generate(u'miąć'):
  z = Znacznik.parse(znacznik)
  if z.fin and z.imperf:
    print(forma, znacznik)

for (forma, lemat, znacznik, _, _) in morf.generate(u'miąć'):
  z = Znacznik.parse(znacznik)
  if z.fin and z.imperf:
    print('>>>', forma, znacznik)

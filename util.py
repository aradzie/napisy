class Znacznik:
  @staticmethod
  def parse(text):
    znacznik = Znacznik()

    for t0 in text.split(':'):
      for t1 in t0.split('.'):
        if hasattr(znacznik, t1):
          setattr(znacznik, t1, True)

    return znacznik

  acc = False
  adj = False
  adv = False
  aff = False
  akc = False
  comp = False
  conj = False
  dat = False
  f = False
  fin = False
  gen = False
  ger = False
  imperf = False
  imps = False
  inf = False
  inst = False
  interj = False
  interp = False
  loc = False
  m1 = False
  m2 = False
  m3 = False
  n = False
  nagl = False
  nakc = False
  ncol = False
  neg = False
  nom = False
  npraep = False
  pact = False
  pacta = False
  part = False
  pcon = False
  perf = False
  pl = False
  pos = False
  ppas = False
  ppron = False
  ppron12 = False
  ppron3 = False
  praet = False
  pred = False
  prep = False
  pri = False
  sec = False
  sg = False
  subst = False
  ter = False
  voc = False
  wok = False

  @property
  def is_noun(self):
    return self.subst

  @property
  def is_verb(self):
    return self.fin or self.imperf

  @property
  def is_adjective(self):
    return self.adj

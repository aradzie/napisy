/**
 * Finds pairs of items that are close enough to be considered as the same phrase.
 * @param al The list of items to match in the first language.
 * @param bl The list of items to match in the second language.
 * @return A list of pairs of matched items.
 */
export function matchPairs(al, bl) {
  const pairs = [];
  for (const a of al) {
    let c = null;
    for (const b of bl) {
      if (b.other == null) {
        const dab = Math.abs(a.t0.v - b.t0.v);
        if (dab <= 1) {
          if (c == null) {
            c = b;
          } else {
            const dac = Math.abs(a.t0.v - c.t0.v);
            if (dab < dac) {
              c = b;
            }
          }
        }
      }
    }
    if (c != null) {
      pairs.push([a, c]);
      a.other = c;
      c.other = a;
    }
  }
  return pairs;
}

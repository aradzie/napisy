class Srt {
  #items = [];

  add(item) {
    this.#items.push(item);
  }

  get size() {
    return this.#items.length;
  }

  [Symbol.iterator]() {
    return this.#items[Symbol.iterator]();
  }
}

/**
 * Represents an item in an SRT file.
 */
class Item {
  /** Item index. */
  index;
  /** Item start time. */
  t0;
  /** Item end time. */
  t1;
  /** Item text. */
  text;
  /** The other item that is close enough to be considered as the same phrase. */
  other = null;

  constructor(index, t0, t1, text) {
    this.index = index;
    this.t0 = t0;
    this.t1 = t1;
    this.text = text;
  }
}

/**
 * Represents a timestamp of an item in an SRT file.
 */
class Timestamp {
  /** Hour. */
  h;
  /** Minute. */
  m;
  /** Second. */
  s;
  /** Millisecond. */
  f;
  /** Value in seconds. */
  v;
  constructor(h, m, s, f) {
    this.h = h;
    this.m = m;
    this.s = s;
    this.f = f;
    this.v = h * 3600 + m * 60 + s + f / 1000;
  }

  valueOf() {
    return this.v;
  }

  toString() {
    return `${this.h}:${this.m}:${this.s},${this.f}`;
  }
}

export { Srt, Item, Timestamp };

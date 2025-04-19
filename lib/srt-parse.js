import { Item, Srt, Timestamp } from "./srt.js";

/**
 * Parses the contents of an SRT file.
 * @param content The content of the SRT file.
 * @return {Srt} An SRT object.
 */
function parseSrt(content) {
  const items = new Srt();

  let state = "index";
  let sIndex = null;
  let sTime = null;
  let sText = null;

  const push = () => {
    if (sIndex && sTime && sText) {
      const index = parseIndex(sIndex);
      const [t0, t1] = parseTime(sTime);
      const t = filter(sText);
      if (t) {
        items.add(new Item(index, t0, t1, sText));
      }
    }
    state = "index";
    sIndex = null;
    sTime = null;
    sText = null;
  };

  for (const line of content.split("\n")) {
    if (line === "") {
      push();
    } else {
      switch (state) {
        case "index": {
          sIndex = line;
          state = "time";
          break;
        }
        case "time": {
          sTime = line;
          state = "text";
          break;
        }
        case "text": {
          if (sText == null) {
            sText = line;
          } else {
            sText = sText + " " + line;
          }
          state = "text";
          break;
        }
      }
    }
  }

  push();

  return items;
}

function parseIndex(v) {
  return Number(v);
}

function parseTime(v) {
  const re = /^(\d{2}):(\d{2}):(\d{2}),(\d{3})\s-->\s(\d{2}):(\d{2}):(\d{2}),(\d{3})$/;
  const m = re.exec(v);
  if (m == null) {
    throw new Error(`Cannot parse [${v}]`);
  }
  return [
    new Timestamp(Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])),
    new Timestamp(Number(m[5]), Number(m[6]), Number(m[7]), Number(m[8])),
  ];
}

function filter(text) {
  if (text.startsWith("♪") && text.endsWith("♪")) {
    return null;
  }
  if (text.startsWith("[") && text.endsWith("]")) {
    return null;
  }
  return text || null;
}

export { parseSrt };

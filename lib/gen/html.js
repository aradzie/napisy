import { marked } from "marked";

export const html = {
  p: (str) => `<p>${str}</p>`,
  i: (str) => `<em>${str}</em>`,
  b: (str) => `<strong>${str}</strong>`,
  mdparse: (text) => marked.parse(text, {}).trim(),
};

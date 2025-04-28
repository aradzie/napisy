import { color } from "./lib/color.js";
import { Database } from "./lib/database.js";
import { prompt } from "./lib/prompt.js";

const database = await Database.open(["./data/phrases.txt"]);

while (true) {
  await ask(database.pickItem());
}

async function ask(item) {
  process.stdout.write(`${color.dim(`------------------------------`)}\n`);
  let a;
  a = await prompt(`q: ${color.blue(item.q)}\n`, [" ", "q"]);
  if (a === "q") {
    process.exit();
  }
  a = await prompt(`a: ${color.magenta(item.a)} (1,2,3)\n`, ["1", "2", "3", "q"]);
  if (a === "q") {
    process.exit();
  }
  switch (a) {
    case "1":
      await database.updateItem(item, 1);
      break;
    case "2":
      await database.updateItem(item, 2);
      break;
    case "3":
      await database.updateItem(item, 3);
      break;
  }
}

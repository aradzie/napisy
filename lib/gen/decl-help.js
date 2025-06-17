import { marked } from "marked";

const help = {
  genitive: marked
    .parse(
      `Dopełniacz

|              |lp               |lm            |
|:-------------|:----------------|:-------------|
|*kogo? czego?*|dobrego człowieka|dobrych ludzi |
|*kogo? czego?*|dobrej kobiety   |dobrych kobiet|
|*kogo? czego?*|dobrego dziecka  |dobrych dzieci|
`.trim(),
      {},
    )
    .trim(),
  dative: marked
    .parse(
      `Celownik

|              |lp                 |lm             |
|:-------------|:------------------|:--------------|
|*komu? czemu?*|dobremu człowiekowi|dobrym ludziom |
|*komu? czemu?*|dobrej kobiecie    |dobrym kobietom|
|*komu? czemu?*|dobremu dziecku    |dobrym dzieciom|
`.trim(),
      {},
    )
    .trim(),
  accusative: marked
    .parse(
      `Biernik

|           |lp               |lm           |
|:----------|:----------------|:------------|
|*kogo? co?*|dobrego człowieka|dobrych ludzi|
|*kogo? co?*|dobre dziecko    |dobre dzieci |
|*kogo? co?*|dobrą kobietę    |dobre kobiety|
`.trim(),
      {},
    )
    .trim(),
  instrumental: marked
    .parse(
      `Narzędnik

- *(z kim? z czym?)* z ???
- *(z kim? z czym?)* z ???
- *(z kim? z czym?)* z ???
`.trim(),
      {},
    )
    .trim(),
  locative: marked
    .parse(
      `Miejscownik

- *(o kim? o czym?)* o ???
- *(o kim? o czym?)* o ???
- *(o kim? o czym?)* o ???
`.trim(),
      {},
    )
    .trim(),
};

export { help };

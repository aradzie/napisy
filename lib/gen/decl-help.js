import { marked } from "marked";

const help = {
  nominative: p(
    `Mianownik (*kto? co?*)

|lp             |lm--          |
|:--------------|:-------------|
|dobrzy człowiek|dobrzy ludzie |
|dobra kobieta  |dobre kobiety |
|dobre dziecko  |dobre dzieci  |
`,
  ),

  genitive: p(
    `Dopełniacz (*kogo? czego?*)

|lp               |lm            |
|:----------------|:-------------|
|dobrego człowieka|dobrych ludzi |
|dobrej kobiety   |dobrych kobiet|
|dobrego dziecka  |dobrych dzieci|
`,
  ),

  dative: p(
    `Celownik (*komu? czemu?*)

|lp                 |lm             |
|:------------------|:--------------|
|dobremu człowiekowi|dobrym ludziom |
|dobrej kobiecie    |dobrym kobietom|
|dobremu dziecku    |dobrym dzieciom|
`,
  ),

  accusative: p(
    `Biernik (*kogo? co?*)

|lp               |lm           |
|:----------------|:------------|
|dobrego człowieka|dobrych ludzi|
|dobrą kobietę    |dobre kobiety|
|dobre dziecko    |dobre dzieci |
`,
  ),

  instrumental: p(
    `Narzędnik (*z kim? z czym?*)

|lp                  |lm                 |
|:-------------------|:------------------|
|z dobrym człowiekiem|z dobrymi ludźmi   |
|z dobrą kobietą     |z dobrymi kobietami|
|z dobrym dzieckiem  |z dobrymi dziećmi  |
`,
  ),

  locative: p(
    `Miejscownik (*o kim? o czym?*)

|lp                |lm                 |
|:-----------------|:------------------|
|o dobrym człowieku|o dobrych ludziach |
|o dobrej kobiecie |o dobrych kobietach|
|o dobrym dziecku  |o dobrych dzieciach|
`,
  ),
};

function p(text) {
  return marked.parse(text.trim(), {}).trim();
}

export { help };

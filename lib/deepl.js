// https://developers.deepl.com/docs/api-reference/translate

import { niceTry } from "./nice-try.js";

const API_KEY = "45faeac7-afc7-4343-aa06-6807938c39a5:fx";

async function translateText(text, targetLang, sourceLang = "PL") {
  return await niceTry({}, impl, text, targetLang, sourceLang);
}

/**
 * Translates text using the DeepL API.
 * @param {string[]} text - An array of text strings to translate.
 * @param {string} targetLang - The target language code (e.g., 'EN', 'DE', 'FR').
 * @param {string} sourceLang - The source language code.
 * @returns {Promise<[string,string][]>} - The translated text.
 */
async function impl(text, targetLang, sourceLang = "PL") {
  const res = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      target_lang: targetLang,
      source_lang: sourceLang,
    }),
  });
  if (res.ok) {
    const { translations } = await res.json();
    const result = [];
    for (let i = 0; i < text.length; i++) {
      result.push([text[i], translations[i].text]);
    }
    return result;
  } else {
    const { status, statusText, headers } = res;
    const error = new Error(`Error ${res.status}: ${res.statusText}`);
    error.status = status;
    error.statusText = statusText;
    error.headers = [...headers];
    throw error;
  }
}

export { translateText };

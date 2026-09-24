import en, { type Dictionary } from "./en";
import zh from "./zh";

export type { Dictionary };

const dictionaries = { en, zh } satisfies Record<string, Dictionary>;

export const languageLabels = {
  en: "English",
  zh: "中文",
};

export type Language = keyof typeof dictionaries;

export const defaultLanguage: Language = "en";
export const languages = Object.keys(dictionaries) as Language[];

export function isLanguage(value: string): value is Language {
  return value in dictionaries;
}

/** The language a URL is in, falling back to the default outside /{lang}/. */
export function languageOf(url: URL): Language {
  const segment = url.pathname.split("/")[1] ?? "";
  return isLanguage(segment) ? segment : defaultLanguage;
}

export function getDictionary(lang: string): Dictionary {
  return dictionaries[isLanguage(lang) ? lang : defaultLanguage];
}

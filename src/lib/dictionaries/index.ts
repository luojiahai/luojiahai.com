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

export function getDictionary(lang: string): Dictionary {
  return dictionaries[isLanguage(lang) ? lang : defaultLanguage];
}

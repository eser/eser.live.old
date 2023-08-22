export const languages = {
  "tr": { name: "Türkçe", englishName: "Turkish" },
  "en": { name: "English", englishName: "English" },
};

export const defaultLanguageCode = "tr";

export type LanguageCode = keyof typeof languages;
export type Language = typeof languages[typeof defaultLanguageCode];

import fs from "fs";
import path from "path";

type Locale = "en" | "ar";
type Translations = { [key: string]: string };

export const t = (key: string, lang: Locale = "en"): string => {
  try {
    const filePath = path.join(__dirname, `../locales/${lang}.json`);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const translations: Translations = JSON.parse(rawData);
    return translations[key] || key;
  } catch (error) {
    return key;
  }
};

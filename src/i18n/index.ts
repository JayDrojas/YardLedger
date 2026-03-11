import en from './en';
import es from './es';

export type Language = 'en' | 'es';
export type TranslationKey = keyof typeof en;

const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  es,
};

export function getTranslations(lang: Language) {
  return translations[lang];
}

export { en, es };

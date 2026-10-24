import { defaultLang, ui } from './ui';

export type SupportedLocale = keyof typeof ui;

export function useTranslations(lang?: string | null) {
  const safeLang: SupportedLocale =
    lang && lang in ui ? (lang as SupportedLocale) : defaultLang;
  return ui[safeLang];
}

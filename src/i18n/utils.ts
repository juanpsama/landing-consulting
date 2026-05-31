import { defaultLang, ui } from './ui';

export function useTranslations(lang: string) {
  return ui[(lang in ui ? lang : defaultLang) as keyof typeof ui];
}

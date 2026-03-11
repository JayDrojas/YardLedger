import { useAppSelector, type RootState } from '../store';
import { getTranslations, type TranslationKey } from '../i18n';

export function useT() {
  const language = useAppSelector(
    (state: RootState) => state.settings.language
  );
  const t = getTranslations(language);

  return { t, language };
}

export type { TranslationKey };

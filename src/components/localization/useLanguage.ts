import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setLanguage } from '../../redux/slices/root';

const supportedLanguages = {
  ru: 'ru',
  en: 'en',
};

type Languages = keyof typeof supportedLanguages;

const StorageKey = 'features-cv-language';

const useLanguage = () => {
  const theme = useAppSelector((state) => state.root.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      let value = localStorage.getItem(StorageKey) as Languages | null;

      if (!value) {
        value = 'ru';
        localStorage.setItem(StorageKey, value);
      }

      dispatch(setLanguage({ value }));
    }
  }, [theme]);
};

export type { Languages };
export default useLanguage;

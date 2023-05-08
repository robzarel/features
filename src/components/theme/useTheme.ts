import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setTheme } from '../../redux/slices/root';

const supportedThemes = {
  light: 'light',
  dark: 'dark',
};

type Themes = keyof typeof supportedThemes;

const StorageKey = 'features-color-theme';

const useTheme = () => {
  const theme = useAppSelector((state) => state.root.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      let value = localStorage.getItem(StorageKey) as Themes | null;

      if (!value) {
        value = 'light';
        localStorage.setItem(StorageKey, value);
      }

      dispatch(setTheme({ value }));
    }
  }, [theme]);
};

export type { Themes };

export default useTheme;

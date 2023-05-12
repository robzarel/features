import { useEffect } from 'react';

import Styles from './index.module.css';

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setTheme } from '../../redux/slices/root';

const supportedThemes = {
  light: 'light',
  dark: 'dark',
};

type Themes = keyof typeof supportedThemes;

const ThemeToggler = () => {
  const theme = useAppSelector((state) => state.root.theme);
  const dispatch = useAppDispatch();

  const handleSwitchTheme = () => {
    if (theme === 'dark') {
      dispatch(setTheme({ value: 'light' }));
    } else {
      dispatch(setTheme({ value: 'dark' }));
    }
  };

  useEffect(() => {
    localStorage.setItem('features-color-theme', theme);
  }, [theme]);

  return (
    <div className={Styles.simpleToggler} onClick={handleSwitchTheme}>
      <div className={Styles.ball} data-theme={theme} />
    </div>
  );
};

export type { Themes };
export default ThemeToggler;

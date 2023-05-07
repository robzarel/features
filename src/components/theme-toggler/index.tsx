import React from 'react';

import Styles from './index.module.css';

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setTheme } from '../../redux/slices/theme';

const ThemeToggler = () => {
  const theme = useAppSelector((state) => state.theme.value);
  const dispatch = useAppDispatch();

  const handleSwitchTheme = () => {
    if (theme === 'dark') {
      dispatch(setTheme({ value: 'light' }));
    } else {
      dispatch(setTheme({ value: 'dark' }));
    }
  };

  return (
    <div className={Styles.simpleToggler} onClick={handleSwitchTheme}>
      <div className={Styles.ball} data-theme={theme} />
    </div>
  );
};

export default ThemeToggler;

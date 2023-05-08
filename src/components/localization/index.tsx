import React from 'react';

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setLanguage } from '../../redux/slices/root';
import type { Languages } from './useLanguage';

import Styles from './index.module.css';

const LanguageToggler = () => {
  const language = useAppSelector((state) => state.root.language);
  const dispatch = useAppDispatch();

  const getHandler = (language: Languages) => () => {
    dispatch(setLanguage({ value: language }));
  };

  return (
    <div className={Styles.simpleToggler}>
      <div
        className={Styles.lang}
        onClick={getHandler('en')}
        data-is-active={language === 'en'}
      >
        EN
      </div>
      <div
        className={Styles.lang}
        onClick={getHandler('ru')}
        data-is-active={language === 'ru'}
      >
        RU
      </div>
    </div>
  );
};

export default LanguageToggler;

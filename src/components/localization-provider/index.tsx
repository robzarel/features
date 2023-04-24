import React, { useEffect, createContext, useState, useContext } from 'react';

import Styles from './index.module.css';

const supportedLanguages = {
  ru: 'ru',
  en: 'en',
};

type Languages = keyof typeof supportedLanguages;

const StorageKey = 'features-cv-language';
const LanguageContext = createContext<
  | {
      language: Languages;
      setLanguage: (language: Languages) => void;
      supportedLanguages: { [key: string]: string };
    }
  | undefined
>(undefined);

const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'You can use "useLanguage" hook only within a <LanguageProvider> component.'
    );
  }

  return context;
};

const getLanguage = (): Languages => {
  let language = localStorage.getItem(StorageKey);

  if (!language) {
    localStorage.setItem(StorageKey, 'ru');
    language = 'ru';
  }

  return language as Languages;
};

const Language = (props: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Languages>(getLanguage);

  useEffect(() => {
    localStorage.setItem(StorageKey, language);
    document.documentElement.setAttribute('data-language', language);
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        supportedLanguages,
      }}
    >
      {props.children}
    </LanguageContext.Provider>
  );
};

Language.SimpleToggler = function SimpleToggler() {
  const { language, setLanguage } = useLanguage();

  const getHandler = (language: Languages) => () => {
    setLanguage(language);
  };

  return (
    <div className={Styles.simpleToggler}>
      <div
        className={Styles.lang}
        onClick={getHandler('en')}
        data-is-active={language === 'en'}
      >
        en
      </div>
      <div
        className={Styles.lang}
        onClick={getHandler('ru')}
        data-is-active={language === 'ru'}
      >
        ru
      </div>
    </div>
  );
};

export { useLanguage };
export type { Languages };
export default Language;

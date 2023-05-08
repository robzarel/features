import React from 'react';
import { useMatch } from 'react-router-dom';

import { Outlet } from 'react-router-dom';

import ThemeToggler from '../theme';
import LanguageToggler from '../localization';
import Footer from '../footer';
import Navigation from '../navigation';

import Styles from './index.module.css';

const Layout = () => {
  const match = useMatch('/cv');

  return (
    <div className={Styles.layout}>
      <header className={Styles.header}>
        <div className={Styles.wrapper}>
          <div className={Styles.content}>
            <div className={Styles.navigation}>
              <Navigation mode='horizontal' />
            </div>
            {match && (
              <div className={Styles.languageToggler}>
                <LanguageToggler />
              </div>
            )}
            <div className={Styles.themeToggler}>
              <ThemeToggler />
            </div>
          </div>
        </div>
      </header>
      <main className={Styles.main}>
        <div className={Styles.wrapper}>
          <Outlet />
        </div>
      </main>
      <footer className={Styles.footer}>
        <div className={Styles.wrapper}>
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default Layout;

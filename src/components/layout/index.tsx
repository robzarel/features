import React from 'react';
import { useMatch } from 'react-router-dom';

import { Outlet } from 'react-router-dom';

import Theme from '../theme-provider';
import Localization from '../localization-provider';
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
                <Localization.SimpleToggler />
              </div>
            )}
            <div className={Styles.themeToggler}>
              <Theme.SimpleToggler />
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

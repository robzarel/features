import React from 'react';

import { Outlet } from 'react-router-dom';

import Theme from '../theme-provider';

import Footer from '../footer';
import Navigation from '../navigation';

import Styles from './index.module.css';

const Layout = () => {
  return (
    <div className={Styles.layout}>
      <header className={Styles.header}>
        <div className={Styles.wrapper}>
          <div className={Styles.content}>
            <Navigation mode='horizontal' />
            <div className={Styles.toggler}>
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

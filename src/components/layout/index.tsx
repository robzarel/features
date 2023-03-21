import React from 'react';

import { Outlet } from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';
import Navigation from '../navigation';

import Styles from './index.module.css';

const Layout = () => {
  return (
    <div className={Styles.layout}>
      <header className={Styles.header}>
        <div className={Styles.wrapper}>
          <Header />
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

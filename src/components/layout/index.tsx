import React from 'react';

import { Outlet } from 'react-router-dom';
import About from '../about';
import Contacts from '../contacts';
import Footer from '../footer';

import Styles from './index.module.css';

const Layout = () => {
  return (
    <div className={Styles.layout}>
      <header className={Styles.header}>
        <div className={Styles.about}>
          <div className={Styles.wrapper}>
            <About />
          </div>
        </div>
        <div className={Styles.contacts}>
          <div className={Styles.wrapper}>
            <Contacts />
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

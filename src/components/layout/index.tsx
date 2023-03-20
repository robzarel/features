import React from 'react';

import { Outlet } from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';
import Navigation from '../navigation';

import Styles from './index.module.css';

const Layout = () => {
  return (
    <div className={Styles.wrapper}>
      <header className={Styles.header}>
        <Header>
          <Navigation />
        </Header>
      </header>
      <main className={Styles.main}>
        <Outlet />
      </main>
      <footer className={Styles.footer}>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;

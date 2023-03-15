import React from 'react';

import { Outlet } from 'react-router-dom';
import Navigation from '../navigation';

import Styles from './index.module.css';

const Layout = () => {
  return (
    <div className={Styles.wrapper}>
      <Navigation />
      <Outlet />
    </div>
  );
};

export default Layout;

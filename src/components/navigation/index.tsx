import React from 'react';

import { NavLink } from 'react-router-dom';
import Styles from './index.module.css';

const Navigation = () => {
  return (
    <div className={Styles.list}>
      <NavLink className={Styles.listItem} to='/'>
        experience
      </NavLink>
      <NavLink className={Styles.listItem} to='/search'>
        search
      </NavLink>
      <NavLink className={Styles.listItem} to='/contacts'>
        contacts
      </NavLink>
    </div>
  );
};

export default Navigation;

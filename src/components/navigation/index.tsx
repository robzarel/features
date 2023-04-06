import React from 'react';

import { NavLink } from 'react-router-dom';
import Styles from './index.module.css';

type Props = {
  mode?: 'vertical' | 'horizontal';
};

const Navigation = (props: Props) => {
  const { mode = 'horizontal' } = props;

  return (
    <div className={Styles.list} data-mode={mode}>
      <NavLink className={Styles.listItem} to='/'>
        home
      </NavLink>
      <NavLink className={Styles.listItem} to='/search'>
        search
      </NavLink>
    </div>
  );
};

export default Navigation;

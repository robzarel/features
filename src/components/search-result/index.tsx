import React from 'react';

import { NavLink } from 'react-router-dom';

import type { COMMON } from '../../api';

import Styles from './index.module.css';

const SearchResult = (props: COMMON) => {
  const { type, id, name, description } = props;

  return (
    <div key={`${type}${id}`} className={Styles.item}>
      <div>
        <b>name: </b>
        {name}
      </div>
      <div>
        <b>description: </b>
        {description}
      </div>
      <NavLink className={Styles.details} to={`/${type}/${id}`}>
        details...
      </NavLink>
    </div>
  );
};

export default SearchResult;

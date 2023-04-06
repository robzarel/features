import React from 'react';

import { NavLink } from 'react-router-dom';

import type { COMMON } from '../../api';

import Styles from './index.module.css';

const SearchResult = (props: COMMON) => {
  const { type, id, name, description } = props;

  return (
    <div key={`${type}${id}`} className={Styles.item}>
      <p className={Styles.name}>
        <b>{name}</b>
      </p>
      <p className={Styles.description}>{description}</p>
      <NavLink className={Styles.details} to={`/${type}/${id}`}>
        details...
      </NavLink>
    </div>
  );
};

export default SearchResult;

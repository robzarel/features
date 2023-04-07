import React from 'react';

import { useNavigate } from 'react-router-dom';

import type { COMMON } from '../../api';

import Styles from './index.module.css';

const SearchResult = (props: COMMON) => {
  const { type, id, name, description, related } = props;
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/${type}/${id}`, { state: { related } });
  };

  return (
    <div key={`${type}${id}`} className={Styles.item}>
      <p className={Styles.name}>
        <b>{name}</b>
      </p>
      <p className={Styles.description}>{description}</p>
      <button className={Styles.details} onClick={handleDetailsClick}>
        details...
      </button>
    </div>
  );
};

export default SearchResult;

import React from 'react';

import { useNavigate } from 'react-router-dom';

import type { COMMON } from '../../api';

import Styles from './index.module.css';

const SearchResult = (props: COMMON) => {
  const { type, id, name, description, related, hasReadme } = props;
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/${type}/${id}`, { state: { related } });
  };

  return (
    <div key={`${type}${id}`} className={Styles.item}>
      <p className={Styles.name} data-has-readme={hasReadme}>
        <b>{`${name}${hasReadme ? '' : '(wip)'}`}</b>
      </p>
      <p className={Styles.description}>{description}</p>
      <button className={Styles.details} onClick={handleDetailsClick}>
        readme
      </button>
    </div>
  );
};

export default SearchResult;

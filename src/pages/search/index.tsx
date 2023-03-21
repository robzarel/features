import React from 'react';

import Styles from './index.module.css';

const Search = () => {
  return (
    <div className={Styles.wrapper}>
      <p className={Styles.description}>
        search splitted in two columns will be here soon: projects+features vs
        solutions+snippets
      </p>
      <div className={Styles.columns}>
        <div className={Styles.business}>projects+features</div>
        <div className={Styles.development}>solutions+snippets</div>
      </div>
    </div>
  );
};

export default Search;

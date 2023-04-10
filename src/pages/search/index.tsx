import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

import SearchResult from '../../components/search-result';

import api from '../../api';
import type { COMMON } from '../../api';

import crossIcon from './images/cross.svg';

import Styles from './index.module.css';

const Search = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<COMMON[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetched = await api.get.common();

      setData(fetched);
    };

    fetchData();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const handleClose = () => {
    setSearch('');
  };

  const filtered = data
    .filter(({ name, description }) =>
      `${name}${description}`.toLocaleLowerCase().includes(search)
    )
    .sort((a, b) => Number(b.hasReadme) - Number(a.hasReadme));

  const projects = filtered.filter(({ type }) => type === 'project');
  const features = filtered.filter(({ type }) => type === 'feature');
  const snippets = filtered.filter(({ type }) => type === 'snippet');

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.search}>
        <input
          className={Styles.input}
          type='text'
          onChange={handleChange}
          value={search}
          placeholder='search by name or description'
        />
        <div
          className={Styles.close}
          data-has-value={search.length > 0}
          onClick={handleClose}
        >
          <img className={Styles.cross} src={crossIcon} alt='' />
        </div>
      </div>
      <div className={Styles.results}>
        <div className={Styles.resultHeading}></div>
        <div className={Styles.projects}>
          <div className={Styles.resultTitle}>Projects</div>
          {projects.map((item) => (
            <SearchResult key={item.id} {...item} />
          ))}
        </div>
        <div className={Styles.features}>
          <div className={Styles.resultTitle}>Features</div>
          {features.map((item) => (
            <SearchResult key={item.id} {...item} />
          ))}
        </div>
        <div className={Styles.snippets}>
          <div className={Styles.resultTitle}>Snippets</div>
          {snippets.map((item) => (
            <SearchResult key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;

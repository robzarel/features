import React, { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

import api from '../../api';

import type { RELATED } from '../../types/common';

import crossIcon from './images/cross.svg';

import Styles from './index.module.css';

const Search = () => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState<RELATED[]>([]);

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

  const filtered = data.filter(({ name, description }) =>
    `${name}${description}`.toLocaleLowerCase().includes(search)
  );

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
        {filtered.map((item) => {
          return (
            <div key={`${item.type}${item.id}`} className={Styles.item}>
              <div>
                {item.type}, {item.id}
              </div>
              <div>
                <b>name: </b>
                {item.name}
              </div>
              <div>
                <b>description: </b>
                {item.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;

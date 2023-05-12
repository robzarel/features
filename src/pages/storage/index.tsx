import React, { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setCommon } from '../../redux/slices/root';

import onlyLetters from 'pure-validators/lib/validators/only-letters';
import { useTextFormField } from 'pure-validators/lib/form-validation-hooks';

import SearchResult from '../../components/search-result';

import api from '../../api';

import crossIcon from './images/cross.svg';

import Styles from './index.module.css';

const validators = [onlyLetters('allowed only letters')];

const Storage = () => {
  const search = useTextFormField('name', validators);

  const dispatch = useAppDispatch();
  const common = useAppSelector((state) => state.root.common);

  const { data } = useQuery({
    queryKey: ['common'],
    queryFn: api.get.common,
    enabled: common === undefined,
  });

  useEffect(() => {
    data && dispatch(setCommon({ value: data }));
  }, [data]);

  const handleClose = () => {
    search.reset();
  };

  const filtered = common
    ? common
        .filter(({ name, description }) =>
          `${name}${description}`.toLocaleLowerCase().includes(search.value)
        )
        .sort((a, b) => Number(b.hasReadme) - Number(a.hasReadme))
    : [];

  const projects = filtered.filter(({ type }) => type === 'project');
  const features = filtered.filter(({ type }) => type === 'feature');
  const snippets = filtered.filter(({ type }) => type === 'snippet');

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.search}>
        <input
          className={Styles.input}
          type='text'
          onChange={search.handleChange}
          value={search.value}
          placeholder='search by name or description'
          data-error={!!search.error}
        />
        <div
          className={Styles.close}
          data-has-value={search.value.length > 0}
          onClick={handleClose}
        >
          <img className={Styles.cross} src={crossIcon} alt='' />
        </div>
        {search.error && <p className={Styles.inputError}>{search.error}</p>}
      </div>
      <div className={Styles.results}>
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
        <div className={Styles.projects}>
          <div className={Styles.resultTitle}>Projects</div>
          {projects.map((item) => (
            <SearchResult key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Storage;

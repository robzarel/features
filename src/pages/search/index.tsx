import React, { useState } from 'react';
import type { ChangeEvent } from 'react';

import crossIcon from './images/cross.svg';

import PROJECT from '../../types/entities/project';
import FEATURE from '../../types/core/feature';
import SOLUTION from '../../types/core/solution';
import SNIPPET from '../../types/core/snippet';

import Styles from './index.module.css';

type Props = {
  project?: PROJECT[];
  feature?: FEATURE[];
  solution?: SOLUTION[];
  snippet?: SNIPPET[];
};
type Type = 'project' | 'feature' | 'solution' | 'snippet';

const extractData = <T extends PROJECT | FEATURE | SOLUTION | SNIPPET>(
  data: T[],
  type: Type
) =>
  data.map((item) => ({
    type: type,
    id: item.id,
    name: item.name,
    description: item.description,
  }));

const Search = (props: Props) => {
  const [search, setSearch] = useState('');
  const { project = [], feature = [], solution = [], snippet = [] } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const handleClose = () => {
    setSearch('');
  };

  const data = extractData(project, 'project');

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.search}>
        <input
          className={Styles.input}
          type='text'
          onChange={handleChange}
          value={search}
          placeholder='type value to search...'
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
        {data.map((item) => {
          return (
            <div key={`${item.type}${item.id}`}>
              <div>{item.id}</div>
              <div>{item.name}</div>
              <div>{item.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;

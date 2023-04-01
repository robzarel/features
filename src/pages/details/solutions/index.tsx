import React, { useState, useEffect } from 'react';

import { NavLink } from 'react-router-dom';

import { default as SolutionsType } from '../../../types/entities/solutions';

import Styles from './index.module.css';

const Solutions = () => {
  const [solutions, setSolutions] = useState<SolutionsType>([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      const fetched = await fetch(
        'https://raw.githubusercontent.com/robzarel/features/main/src/server/db/solutions.json'
      );
      const parsed = await fetched.json();
      setSolutions(parsed);
    };

    fetchSnippets();
  }, []);

  return (
    <div className={Styles.wrapper}>
      {solutions.map((item) => (
        <div key={item.id} className={Styles.solution}>
          <p>
            <span>{`№${item.id}`}</span> {item.name}
          </p>
          <p>{item.description}</p>
          <NavLink to={`/solution/${item.id}`}>Details...</NavLink>
        </div>
      ))}
    </div>
  );
};

export default Solutions;

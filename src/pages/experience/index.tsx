import React, { useState, useEffect } from 'react';

import Styles from './index.module.css';

import EXPERIENCE from '../../types/entities/experience';

const Experience = () => {
  const [experience, setExperience] = useState<EXPERIENCE[]>([]);

  useEffect(() => {
    const fetchExp = async () => {
      const fetched = await fetch('http://localhost:3001/api/experience');
      const parsed = await fetched.json();
      setExperience(parsed);
    };

    fetchExp();
  }, []);

  const devRoles = experience.filter((item) => item.kind === 'development');
  const mngRoles = experience.filter((item) => item.kind === 'management');

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.column}>
        {devRoles.map((item) => (
          <div key={item.id}>{item.role}</div>
        ))}
      </div>
      <div className={Styles.column}>
        {mngRoles.map((item) => (
          <div key={item.id}>{item.role}</div>
        ))}
      </div>
    </div>
  );
};

export default Experience;

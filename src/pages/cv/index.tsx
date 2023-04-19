import React, { useState, useEffect } from 'react';

import api from '../../api';

import WorkExperience from '../../components/experience';
import Skill from '../../components/skill';
import Education from '../../components/education';
import About from '../../components/about';

import type { CV } from '../../types/common';

import Styles from './index.module.css';

const Experience = () => {
  const [cv, setCv] = useState<CV>();

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.get.cv();

      setCv(data);
    };

    fetchData();
  }, []);

  const handleDonwloadClick = () => {
    window.print();
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.about}>
        <About />
      </div>
      <div className={Styles.columns}>
        <div className={Styles.leftColumn}>
          <h2 className={Styles.title}>
            Опыт работы{' '}
            <span
              className={Styles.download}
              onClick={handleDonwloadClick}
              title='скачать'
            />
          </h2>
          {cv &&
            cv.experience.map((item) => (
              <WorkExperience key={item.id} {...item} />
            ))}
        </div>
        <div className={Styles.rightColumn}>
          <div className={Styles.skills}>
            <h2 className={Styles.title}>Навыки</h2>
            {cv && cv.skills.map((item) => <Skill key={item.id} {...item} />)}
          </div>
          <div className={Styles.education}>
            <h2 className={Styles.title}>Образование</h2>
            {cv &&
              cv.education.map((item) => <Education key={item.id} {...item} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;

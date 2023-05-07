import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import api from '../../api';
import { useLanguage } from '../../components/localization-provider';

import WorkExperience from '../../components/experience';
import Skill from '../../components/skill';
import Education from '../../components/education';
import About from '../../components/about';

import Styles from './index.module.css';

const map = {
  experience: {
    ru: 'Опыт работы',
    en: 'Work experience',
  },
  skills: {
    ru: 'Навыки',
    en: 'Skills',
  },
  education: {
    ru: 'Образование',
    en: 'Education',
  },
  download: {
    ru: 'скачать',
    en: 'download',
  },
};

const Experience = () => {
  const { language } = useLanguage();

  const { data: cv } = useQuery({
    queryKey: ['cv'],
    queryFn: api.get.cv,
  });

  useEffect(() => {
    document.title = 'Lazarev Boris';

    return () => {
      document.title = 'features';
    };
  }, []);

  const handleDonwloadClick = () => {
    window.print();
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.about}>
        <About lang={language} />
      </div>
      <div className={Styles.columns}>
        <div className={Styles.leftColumn}>
          <h2 className={Styles.title}>
            {map.experience[language]}
            <span
              className={Styles.download}
              onClick={handleDonwloadClick}
              title={map.download[language]}
            />
          </h2>
          {cv &&
            cv.experience.map((item) => (
              <>
                <WorkExperience key={item.id} {...item} />
                <br />
              </>
            ))}
        </div>
        <div className={Styles.rightColumn}>
          <div className={Styles.skills}>
            <h2 className={Styles.title}>{map.skills[language]}</h2>
            {cv && cv.skills.map((item) => <Skill key={item.id} {...item} />)}
          </div>
          <div className={Styles.education}>
            <h2 className={Styles.title}>{map.education[language]}</h2>
            {cv &&
              cv.education.map((item) => <Education key={item.id} {...item} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;

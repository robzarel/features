import React from 'react';

import Photo from './images/me.jpeg';
import Styles from './index.module.css';

const map = {
  fullName: {
    ru: 'Лазарев Борис',
    en: 'Lazarev Boris',
  },
  role: {
    ru: 'Ведущий frontend разработчик',
    en: 'Senior frontend engineer',
  },
  abstract: {
    ru: (workYears: number) =>
      `Frontend разработчик с ${workYears}+ годами опыта в сфере IT`,
    en: (workYears: number) =>
      `Software engineer with ${workYears}+ years of experience in IT`,
  },
};
const About = ({ lang }: { lang: 'ru' | 'en' }) => {
  const workYears = new Date().getFullYear() - 2015;

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.photoWrapper}>
        <img className={Styles.photo} src={Photo} alt='photo' />
      </div>
      <div className={Styles.info}>
        <h1 className={Styles.fullName}>{map.fullName[lang]}</h1>
        <h3 className={Styles.role}>{map.role[lang]}</h3>
        <p className={Styles.abstract}>{map.abstract[lang](workYears)}</p>
      </div>
    </div>
  );
};

export default About;

import React from 'react';

import Photo from './images/me.jpeg';
import Styles from './index.module.css';

const About = () => {
  const workYears = new Date().getFullYear() - 2015;

  return (
    <div className={Styles.wrapper}>
      <img className={Styles.photo} src={Photo} alt='photo' />
      <div className={Styles.info}>
        <h1 className={Styles.fullName}>Boris Lazarev</h1>
        <h3 className={Styles.role}>Senior Frontend Developer</h3>
        <p className={Styles.abstract}>
          Software engineer with {workYears}+ years of experience in IT
        </p>
      </div>
    </div>
  );
};

export default About;

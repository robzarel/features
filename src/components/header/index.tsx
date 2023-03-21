import React from 'react';

import Theme from '../theme-provider';
import SocialLink from '../social-link';

import Styles from './index.module.css';

const Header = () => {
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.toggler}>
        <Theme.SimpleToggler />
      </div>
      <div className={Styles.info}>
        <h1 className={Styles.fullName}>Boris Lazarev</h1>
        <h3 className={Styles.role}>Senior Frontend Developer</h3>
        <p className={Styles.abstract}>
          Software engineer with 7+ years of experience in IT
        </p>
      </div>
      <div className={Styles.contacts}>
        <div className={Styles.link}>
          <SocialLink
            href='mailto:robzarel@yandex.ru'
            text='robzarel@yandex.ru'
            network='mail'
          />
        </div>
        <div className={Styles.link}>
          <SocialLink
            href='https://www.linkedin.com/in/robzarel'
            text='linkedin.com/in/robzarel'
            network='linkedin'
          />
        </div>
        <div className={Styles.link}>
          <SocialLink
            href='https://www.facebook.com/rob.zarel'
            text='facebook.com/rob.zarel'
            network='facebook'
          />
        </div>
        <div className={Styles.link}>
          <SocialLink
            href='https://t.me/rob_zarel'
            text='@rob_zarel'
            network='telegram'
          />
        </div>
      </div>
      <div className={Styles.photo} />
    </div>
  );
};

export default Header;

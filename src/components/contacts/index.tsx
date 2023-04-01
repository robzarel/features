import React from 'react';

import SocialLink from '../social-link';

import Styles from './index.module.css';

const Contacts = () => {
  return (
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
  );
};

export default Contacts;

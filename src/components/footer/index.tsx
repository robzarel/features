import React from 'react';
import Styles from './index.module.css';
import Contacts from '../contacts';

const Footer = () => {
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.contacts}>
        <Contacts />
      </div>
    </div>
  );
};

export default Footer;

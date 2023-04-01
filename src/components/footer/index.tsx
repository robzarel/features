import React from 'react';
import Styles from './index.module.css';

import Navigation from '../navigation';

const Footer = () => {
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.siteMap}>
        <h4 className={Styles.title}>Navigation</h4>
        <Navigation mode='vertical' />
      </div>
    </div>
  );
};

export default Footer;

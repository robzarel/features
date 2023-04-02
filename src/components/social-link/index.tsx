import React, { useState } from 'react';

import Styles from './index.module.css';

import mail from './images/mail.svg';
import telegram from './images/telegram.svg';
import linkedin from './images/linkedin.svg';
import facebook from './images/facebook.svg';
import check from './images/check.svg';

const map = {
  mail: mail,
  telegram: telegram,
  linkedin: linkedin,
  facebook: facebook,
};

type Props = {
  href: string;
  text: string;
  network: 'mail' | 'telegram' | 'linkedin' | 'facebook';
};
const SocialLink = ({ href, text, network }: Props) => {
  const [wasCopied, setWasCopied] = useState(false);

  const handleCopyClick = () => {
    if (!wasCopied) {
      const copy = href.replace('mailto:', '');
      navigator.clipboard.writeText(copy);

      setWasCopied(true);
      setTimeout(() => {
        setWasCopied(false);
      }, 3000);
    }
  };

  const title = wasCopied ? 'Copied!' : 'Copy to clipboard';
  const icon = wasCopied ? check : map[network];

  return (
    <div className={Styles.wrapper}>
      <img
        className={Styles.icon}
        src={icon}
        alt=''
        title={title}
        onClick={handleCopyClick}
      />
      <a
        className={Styles.link}
        href={href}
        target='_blank'
        rel='noreferrer'
        title='Follow by link'
      >
        {text}
      </a>
    </div>
  );
};

export default SocialLink;

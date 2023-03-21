import React, { useState } from 'react';

import Styles from './index.module.css';

type Props = {
  href: string;
  text: string;
  network: 'mail' | 'telegram' | 'linkedin' | 'facebook';
};
const SocialLink = ({ href, text, network }: Props) => {
  const [wasCopied, setWasCopied] = useState(false);

  const handleCopyClick = () => {
    if (!wasCopied) {
      navigator.clipboard.writeText(href);

      setWasCopied(true);
      setTimeout(() => {
        setWasCopied(false);
      }, 3000);
    }
  };

  const title = wasCopied ? 'Copied!' : 'Copy to clipboard';

  return (
    <div className={Styles.wrapper}>
      <div
        className={Styles.icon}
        data-type={network}
        data-checked={wasCopied}
        onClick={handleCopyClick}
        title={title}
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

import React from 'react';
import Styles from './index.module.css';

import { useTheme } from '../theme-provider';

type Props = {
  children?: React.ReactNode;
};
const Header = (props: Props) => {
  const { theme, setTheme } = useTheme();

  const handleSwitchTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <div className={Styles.wrapper}>
      <button type='button' onClick={handleSwitchTheme}>
        toggle theme
      </button>
      {props.children}
    </div>
  );
};

export default Header;

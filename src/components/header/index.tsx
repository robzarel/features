import React from "react";
import Styles from "./index.module.css";

type Props = {
  children?: React.ReactNode | React.ReactNode[];
};
const Header = (props: Props) => {
  return (
    <div className={Styles.wrapper}>
      Header
      {props.children}
    </div>
  );
};

export default Header;

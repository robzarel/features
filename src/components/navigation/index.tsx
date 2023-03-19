import React from "react";

import { NavLink } from "react-router-dom";
import Styles from "./index.module.css";

const Navigation = () => {
  return (
    <div className={Styles.list}>
      <NavLink className={Styles.listItem} to="/">
        features
      </NavLink>
      <NavLink className={Styles.listItem} to="/categories">
        categories
      </NavLink>
      <NavLink className={Styles.listItem} to="/projects">
        projects
      </NavLink>
      <NavLink className={Styles.listItem} to="/snippets">
        snippets
      </NavLink>
    </div>
  );
};

export default Navigation;

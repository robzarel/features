import React from 'react';

import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <div>
      <ul>
        <li>
          <NavLink to="/snippets">Snippets</NavLink>
        </li>
        <li>
          <NavLink to="/projects">Projects</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;

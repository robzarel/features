import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div>
      <ul>
        <li>
          <NavLink to="/experience">Experience</NavLink>
        </li>
        <li>
          <NavLink to="/code">Code</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;

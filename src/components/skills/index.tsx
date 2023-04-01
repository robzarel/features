import React from 'react';

import SKILL from '../../types/core/skill';

import Styles from './index.module.css';
import { capitalize } from '../../utils';

type Props = {
  data: SKILL[];
};
const Skills = (props: Props) => {
  const { data } = props;

  return (
    <div className={Styles.wrapper}>
      {data.map((skill) => (
        <div className={Styles.skill} key={skill.id}>
          {capitalize(skill.name)}
        </div>
      ))}
    </div>
  );
};

export default Skills;

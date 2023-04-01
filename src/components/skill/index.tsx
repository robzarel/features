import React from 'react';

import SKILL from '../../types/core/skill';

import { capitalize } from '../../utils';

import Styles from './index.module.css';

type Props = SKILL;
const Skill = (props: Props) => {
  const { id, name } = props;

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.skill} key={id}>
        {capitalize(name)}
      </div>
    </div>
  );
};

export default Skill;

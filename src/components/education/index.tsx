import React from 'react';

import EDUCATION from '../../types/core/education';

import Styles from './index.module.css';
import { toUserFormat, capitalize } from '../../utils';

const Education = (props: EDUCATION) => {
  const { started, ended, city, country, id, degree, univercity } = props;

  const startedFrom = toUserFormat(new Date(started));
  const endedAt = toUserFormat(new Date(ended));
  const place = `${capitalize(city)}, ${capitalize(country)}`;

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.item} key={id}>
        <p className={Styles.degree}>{degree}</p>
        <p className={Styles.univercity}>{univercity}</p>
        <p className={Styles.period}>{`${startedFrom}-${endedAt}`}</p>
        <h4 className={Styles.place}>{place}</h4>
      </div>
    </div>
  );
};

export default Education;

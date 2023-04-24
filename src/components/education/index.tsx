import React from 'react';

import EDUCATION from '../../types/secondary/education';

import { toUserFormat, capitalize } from '../../utils';

import { useLanguage } from '../../components/localization-provider';

import Styles from './index.module.css';

type Props = EDUCATION;
const Education = (props: Props) => {
  const { id, started, ended, description } = props;
  const { language } = useLanguage();

  const { city, country, degree, univercity } = description[language];

  const startedFrom = toUserFormat(new Date(started));
  const endedAt = toUserFormat(new Date(ended));
  const place = `${capitalize(city)}, ${capitalize(country)}`;

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.item} key={id}>
        <p className={Styles.degree}>{capitalize(degree)}</p>
        <p className={Styles.univercity}>{capitalize(univercity)}</p>
        <p className={Styles.period}>{`${startedFrom}-${endedAt}`}</p>
        <h4 className={Styles.place}>{place}</h4>
      </div>
    </div>
  );
};

export default Education;

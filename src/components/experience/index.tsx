import React from 'react';

import EXPERIENCE from '../../types/secondary/experience';

import { toUserFormat, capitalize } from '../../utils';

import Styles from './index.module.css';

type Props = EXPERIENCE;
const ExperienceItem = (props: Props) => {
  const { role, city, country, started, ended, company, achievements } = props;
  const startedFrom = toUserFormat(new Date(started));
  const endedAt = ended ? toUserFormat(new Date(ended)) : 'Сейчас';
  const place = `${capitalize(city)}, ${capitalize(country)}`;

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.meta}>
        <h3 className={Styles.role}>{role}</h3>
        <div className={Styles.meta}>
          <p className={Styles.period}>{`${startedFrom}-${endedAt}`}</p>
          <h4 className={Styles.place}>{place}</h4>
        </div>
        <p className={Styles.company}>{company}</p>
      </div>
      <div className={Styles.achievements}>
        <p className={Styles.achievementsTitle}>Достижения/задачи</p>
        <ul className={Styles.achievementsList}>
          {achievements.map((item, index) => (
            <li className={Styles.achievementsItem} key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExperienceItem;

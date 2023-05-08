import React, { useState } from 'react';

import EXPERIENCE from '../../types/secondary/experience';

import { toUserFormat, capitalize } from '../../utils';

import { useAppSelector } from '../../redux/hooks';

import Styles from './index.module.css';

const map = {
  achievements: {
    ru: 'Достижения/задачи',
    en: 'Achievements/tasks',
  },
  more: {
    ru: 'подробнее...',
    en: 'more...',
  },
  less: {
    ru: 'оставить главное',
    en: 'less...',
  },
  endedAt: {
    ru: 'Сейчас',
    en: 'Now',
  },
};

type Props = EXPERIENCE;
const ExperienceItem = (props: Props) => {
  const { started, ended, description } = props;

  const language = useAppSelector((state) => state.root.language);

  const { role, achievements, company, city, country } = description[language];

  const [isExpanded, setExpandedFlag] = useState(false);

  const startedFrom = toUserFormat(new Date(started));
  const endedAt = ended ? toUserFormat(new Date(ended)) : map.endedAt[language];
  const place = `${capitalize(city)}, ${capitalize(country)}`;

  const listItems = isExpanded ? achievements : achievements.slice(0, 3);

  const handleExpanderClick = () => {
    setExpandedFlag((prev) => !prev);
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.meta}>
        <h3 className={Styles.role}>{capitalize(role)}</h3>
        <div className={Styles.meta}>
          <p className={Styles.period}>{`${startedFrom}-${endedAt}`}</p>
          <h4 className={Styles.place}>{place}</h4>
        </div>
        <p className={Styles.company}>{capitalize(company)}</p>
      </div>
      <div className={Styles.achievements}>
        <p className={Styles.achievementsTitle}>{map.achievements[language]}</p>
        <ul className={Styles.achievementsList}>
          {listItems.map((item, index) => (
            <li className={Styles.achievementsItem} key={index}>
              {item}
            </li>
          ))}
        </ul>
        {achievements.length > 3 && (
          <div className={Styles.details}>
            <p
              className={Styles.showDetailsButton}
              onClick={handleExpanderClick}
            >
              {isExpanded ? map.less[language] : map.more[language]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceItem;

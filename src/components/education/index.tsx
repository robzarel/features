import React from 'react';

import EDUCATION from '../../types/core/education';

import Styles from './index.module.css';
import { toUserFormat, capitalize } from '../../utils';

type Props = {
  data: EDUCATION[];
};
const Education = (props: Props) => {
  const { data } = props;

  return (
    <div className={Styles.wrapper}>
      {data.map((item) => {
        const startedFrom = toUserFormat(new Date(item.started));
        const endedAt = toUserFormat(new Date(item.ended));
        const place = `${capitalize(item.city)}, ${capitalize(item.country)}`;

        return (
          <div className={Styles.item} key={item.id}>
            <p>{item.degree}</p>
            <p>{item.univercity}</p>
            <p className={Styles.period}>{`${startedFrom}-${endedAt}`}</p>
            <div className={Styles.place}>
              <p className={Styles.univercity}>{item.univercity}</p>
              <h4 className={Styles.place}>{place}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Education;

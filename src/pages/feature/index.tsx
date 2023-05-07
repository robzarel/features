import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import StyledMarkDown from '../../components/styled-markdown';

import api from '../../api';

import Styles from './index.module.css';

const FeaturePage = () => {
  const { id } = useParams();

  const { data: markdown = '' } = useQuery({
    queryKey: ['markdown'],
    queryFn: () => {
      if (id) {
        return api.get.readme('feature', +id);
      }
    },
  });

  return (
    <div className={Styles.wrapper}>
      <StyledMarkDown md={markdown} />
    </div>
  );
};

export default FeaturePage;

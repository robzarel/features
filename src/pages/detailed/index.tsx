import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import StyledMarkDown from '../../components/styled-markdown';

import api from '../../api';

import Styles from './index.module.css';
type Props = {
  type: 'feature' | 'project' | 'snippet';
};

const DetailedPage = (props: Props) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['markdown'] });
  }, []);

  const { data: markdown = '' } = useQuery({
    queryKey: ['markdown'],
    queryFn: () => {
      if (id) {
        return api.get.readme(props.type, +id);
      }
    },
  });

  return (
    <div className={Styles.wrapper}>
      <StyledMarkDown md={markdown} />
    </div>
  );
};

export default DetailedPage;

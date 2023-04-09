import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import StyledMarkDown from '../../components/styled-markdown';

import api from '../../api';

import Styles from './index.module.css';

const Feature = () => {
  const [markdown, setMarkdown] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchFeature = async (id: number) => {
      const data: string = await api.get.readme('feature', id);

      setMarkdown(data);
    };

    id && fetchFeature(+id);
  }, []);

  return (
    <div className={Styles.wrapper}>
      <StyledMarkDown md={markdown} />
    </div>
  );
};

export default Feature;

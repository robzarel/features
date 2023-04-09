import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import StyledMarkDown from '../../components/styled-markdown';

import api from '../../api';

import Styles from './index.module.css';

const SnippetPage = () => {
  const [markdown, setMarkdown] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchReadme = async (id: number) => {
      const md: string = await api.get.readme('snippet', id);

      setMarkdown(md);
    };

    id && fetchReadme(+id);
  }, []);

  return (
    <div className={Styles.wrapper}>
      <StyledMarkDown md={markdown} />
    </div>
  );
};

export default SnippetPage;

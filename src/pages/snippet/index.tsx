import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Snippet from '../../components/snippet';
import type { default as SnippetType } from '../../types/core/snippet';

import api from '../../api';

import Styles from './index.module.css';

const SnippetPage = () => {
  const [snippet, setSnippet] = useState<SnippetType>();
  const { id } = useParams();

  useEffect(() => {
    const fetchSnippets = async (id: number) => {
      const parsed = await api.get.snippet(id);
      setSnippet(parsed);
    };

    id && fetchSnippets(+id);
  }, []);

  return (
    <div className={Styles.wrapper}>
      {snippet && (
        <Snippet
          id={snippet.id}
          code={decodeURI(snippet.code)}
          language={snippet.language}
          name={snippet.name}
          description={snippet.description}
        />
      )}
    </div>
  );
};

export default SnippetPage;

import React, { useState, useEffect } from 'react';

import Styles from './index.module.css';
import Snippet from '../../../components/snippet';

import type { default as SnippetType } from '../../../types/core/snippet';

const Snippets = () => {
  const [snippets, setSnippets] = useState<SnippetType[]>([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      const snippetsPromise = await fetch(
        'https://raw.githubusercontent.com/robzarel/features/main/src/server/db/snippets.json'
      );

      const parsed = await snippetsPromise.json();
      setSnippets(parsed);
    };

    fetchSnippets();
  }, []);

  return (
    <div className={Styles.wrapper}>
      {snippets.map((snippet) => (
        <Snippet
          key={snippet.id}
          id={snippet.id}
          code={decodeURI(snippet.code)}
          language={snippet.language}
          name={snippet.name}
          description={snippet.description}
          category={snippet.category}
        />
      ))}
    </div>
  );
};

export default Snippets;

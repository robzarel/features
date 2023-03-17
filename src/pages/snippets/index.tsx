import React, { useState, useEffect } from 'react';

import Styles from './index.module.css';
import Snippet from '../../components/snippet';

import type { default as SnippetType } from '../../types/core/snippet';
import { default as CategoriesType } from '../../types/core/categories';

const Snippets = () => {
  const [snippets, setSnippets] = useState<SnippetType[]>([]);
  const [categories, setCategories] = useState<CategoriesType>([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      const snippetsPromise = fetch('http://localhost:3001/api/snippets');
      const categoriesPromise = fetch('http://localhost:3001/api/categories');
      const res = await Promise.all([snippetsPromise, categoriesPromise]);
      const snippetsParsed: SnippetType[] = await res[0].json();
      const categoriesParsed: CategoriesType = await res[1].json();

      setSnippets(snippetsParsed);
      setCategories(categoriesParsed);
    };

    fetchSnippets();
  }, []);

  return <div className={Styles.wrapper}>
    {snippets.map((snippet) =>
      <Snippet
        key={snippet.id}
        code={decodeURI(snippet.code)}
        language={snippet.language}
        name={snippet.name}
        description={snippet.description}
        category={categories.find((cat) => cat.id === snippet.categoryId)}
      />)
    }
  </div>;
};

export default Snippets;

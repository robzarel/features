import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import CategoryType from '../../types/core/solution';
// import Styles from './index.module.css';

// import Snippet from '../../components/snippet';

// const MAP_README_SLICE_TO_COMPONENT = {
//   'heading': (content: string) => <p className={Styles.heading}>{content}</p>,
//   'text': (content: string) => <p className={Styles.text}>{content}</p>,
//   'code': (code: string, language: string) => (
//     <Snippet
//         code={decodeURI(code)}
//         language={language}
//         name={snippet.name}
//         description={snippet.description}
//         category={categories.find((cat) => cat.id === snippet.categoryId)}
//       />
//   ),
// };

const Category = () => {
  const [category, setCategory] = useState<CategoryType>();

  const { id } = useParams();

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      const data = await fetch(`http://localhost:3001/api/categories/${id}`);
      const parsed: CategoryType = await data.json();

      setCategory(parsed);
    };

    fetchCategoryInfo();
  }, []);

  const renderCategoryInfo = (cat: CategoryType) => (
    <div>
      <p>
        <span>{cat.name}</span>: {decodeURI(cat.description)}
      </p>
    </div>
  );

  return <div>{category ? renderCategoryInfo(category) : <p>no data </p>}</div>;
};

export default Category;

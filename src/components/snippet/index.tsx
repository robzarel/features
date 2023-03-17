import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { CopyBlock, dracula } from 'react-code-blocks';

import type { default as SnippetType } from '../../types/core/snippet';
import { default as CategoryType } from '../../types/core/category';

import Styles from './index.module.css';

type Props = Pick<SnippetType, 'name' | 'code' | 'language' | 'description'> & {
  category?: Pick<CategoryType, 'id' | 'name' | 'description'>
};

const Snippet = (props: Props) => {
  const { name, code, language, description, category } = props;
  const [isVisible, setVisibility] = useState(false);

  const handleToggleClick = () => {
    setVisibility((prev) => !prev);
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.meta}>
        <p className={Styles.name}>{name}:</p>
        <p className={Styles.description}>{description}</p>
        <button
          className={Styles.toggle}
          type='button'
          value='code'
          onClick={handleToggleClick}
        >code</button>
      </div>
      <div className={Styles.content} data-is-visible={isVisible}>
        <div className={Styles.code}>
          <CopyBlock
            text={code}
            language={language}
            showLineNumbers={false}
            startingLineNumber={1}
            wrapLines
            theme={dracula}
          />
        </div>
        {
          category && 
          <div className={Styles.category}>
            <ul>
              <li>category id: {category.id}</li>
              <li>category name: {category.name}</li>
              <li>category description: {category.description}</li>
            </ul>
            <NavLink to={`/category/${category.id}`}>Details...</NavLink>
          </div>
        }
      </div>
    </div>
  );
};

export default Snippet;

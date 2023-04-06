import React from 'react';

import { CopyBlock, dracula } from 'react-code-blocks';

import type { default as SnippetType } from '../../types/core/snippet';

import Styles from './index.module.css';

const Snippet = (props: SnippetType) => {
  const { id, name, code, language, description } = props;

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.meta}>
        <p className={Styles.name}>{name}</p>
        <p className={Styles.description}>{description}</p>
      </div>
      <div className={Styles.content}>
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
      </div>
    </div>
  );
};

export default Snippet;

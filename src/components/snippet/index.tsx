import React from 'react';

import { CopyBlock, solarizedLight, solarizedDark } from 'react-code-blocks';

import type { default as SnippetType } from '../../types/core/snippet';
import { useAppSelector } from '../../redux/hooks';

import Styles from './index.module.css';

const Snippet = (props: SnippetType) => {
  const { id, name, code, language, description } = props;

  const theme = useAppSelector((state) => state.theme.value);

  const codeTheme = theme === 'dark' ? solarizedDark : solarizedLight;

  return (
    <div className={Styles.wrapper} data-snipper-id={id}>
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
            theme={codeTheme}
          />
        </div>
      </div>
    </div>
  );
};

export default Snippet;

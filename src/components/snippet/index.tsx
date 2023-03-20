import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { CopyBlock, dracula } from "react-code-blocks";

import type { default as SnippetType } from "../../types/core/snippet";

import Styles from "./index.module.css";

const Snippet = (props: SnippetType) => {
  const { id, name, code, language, category } = props;
  const [isVisible, setVisibility] = useState(false);

  const handleToggleClick = () => {
    setVisibility((prev) => !prev);
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.meta}>
        <p className={Styles.id}>{id}:</p>
        <p className={Styles.name}>{name}:</p>
        <button
          className={Styles.toggle}
          type="button"
          value="code"
          onClick={handleToggleClick}
        >
          code
        </button>
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
        {category && (
          <div className={Styles.category}>
            <ul>
              <li>category id: {category.id}</li>
              <li>category name: {category.name}</li>
            </ul>
            <NavLink to={`/category/${category.id}`}>Details...</NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Snippet;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import type FeatureType from '../../types/core/feature';

import api from '../../api';
import { CodeBlock, dracula } from 'react-code-blocks';

import Styles from './index.module.css';

type ReadmeItem = FeatureType['readme'][number];

const README_RENDER_FUNCTION = {
  heading: ({ content }: ReadmeItem) => (
    <p className={Styles.heading}>{`${decodeURIComponent(content)}`}</p>
  ),
  text: ({ content }: ReadmeItem) => (
    <p className={Styles.text}>{decodeURIComponent(content)}</p>
  ),
  code: ({ content, language }: ReadmeItem) => (
    <div className={Styles.code}>
      <CodeBlock
        text={decodeURIComponent(content)}
        language={language}
        showLineNumbers={true}
        startingLineNumber={1}
        theme={dracula}
      />
    </div>
  ),
};

const Feature = () => {
  const [feature, setFeatures] = useState<FeatureType>();
  const { id } = useParams();

  useEffect(() => {
    const fetchFeature = async (id: number) => {
      const data = await api.get.feature(id);
      console.log('data', data);

      setFeatures(data);
    };

    id && fetchFeature(+id);
  }, []);

  return (
    <div>
      {feature &&
        feature.readme.map((item, index) => {
          return (
            <div key={index}>{README_RENDER_FUNCTION[item.type](item)}</div>
          );
        })}
    </div>
  );
};

export default Feature;

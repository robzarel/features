import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import type FeatureType from '../../types/core/feature';

import api from '../../api';
import { CodeBlock, dracula } from 'react-code-blocks';

import Styles from './index.module.css';

type ReadmeItem = FeatureType['readme'][number];

const README_RENDER_FUNCTION = {
  heading: ({ content }: ReadmeItem) => (
    <p className={Styles.heading}>{content}</p>
  ),
  text: ({ content }: ReadmeItem) => <p className={Styles.text}>{content}</p>,
  code: ({ content, language }: ReadmeItem) => (
    <CodeBlock
      code={decodeURI(content)}
      language={language}
      showLineNumbers={true}
      startingLineNumber={1}
      theme={dracula}
    />
  ),
};

const Feature = () => {
  const [feature, setFeatures] = useState<FeatureType>();
  const { id } = useParams();

  useEffect(() => {
    const fetchFeature = async (id: number) => {
      const data = await api.get.feature(id);

      setFeatures(data);
    };

    id && fetchFeature(+id);
  }, []);

  return (
    <div>
      {feature?.readme.map((item, index) => {
        return <div key={index}>{README_RENDER_FUNCTION[item.type](item)}</div>;
      })}
    </div>
  );
};

export default Feature;

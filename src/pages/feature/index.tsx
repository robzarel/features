import React, { useState, useEffect } from 'react';
import { useLocation, useParams, NavLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import type FeatureType from '../../types/core/feature';
import type { RELATED } from '../../types/common';
import api from '../../api';
import { CodeBlock, solarizedLight, solarizedDark } from 'react-code-blocks';

// import { useTheme } from '../../components/theme-provider';

import Styles from './index.module.css';

type ReadmeItem = FeatureType['readme'][number] & { theme: any };

const README_RENDER_FUNCTION = {
  heading: ({ content }: ReadmeItem) => (
    // <p className={Styles.heading}>{`${decodeURIComponent(content)}`}</p>
    <ReactMarkdown>{`${decodeURIComponent(content)}`}</ReactMarkdown>
  ),
  text: ({ content }: ReadmeItem) => (
    <p className={Styles.text}>{decodeURIComponent(content)}</p>
  ),
  code: ({ content, language, theme }: ReadmeItem) => (
    <div className={Styles.code}>
      <CodeBlock
        text={decodeURIComponent(content)}
        language={language}
        showLineNumbers={true}
        startingLineNumber={1}
        theme={theme}
      />
    </div>
  ),
};
type LOCATION_STATE = {
  state: {
    related: RELATED[];
  };
};

// https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight
const Feature = () => {
  const [txt, setTxt] = useState('');
  const { id } = useParams();

  const { state }: LOCATION_STATE = useLocation();

  useEffect(() => {
    const fetchFeature = async (id: number) => {
      const data: string = await api.get.readme('feature', id);

      setTxt(data);
    };

    id && fetchFeature(+id);
  }, []);
  const relatedProjects =
    state?.related?.filter(({ type }) => type === 'project') || [];
  const relatedFeatures =
    state?.related?.filter(({ type }) => type === 'feature') || [];
  const relatedSnippets =
    state?.related?.filter(({ type }) => type === 'snippet') || [];

  return (
    <div className={Styles.wrapper}>
      <ReactMarkdown>{txt}</ReactMarkdown>
      {false && (
        <div className={Styles.relared}>
          <div className={Styles.projects}>
            <h3>projects</h3>
            {relatedProjects.map(({ type, id }) => (
              <NavLink key={`${type}:${id}`} to={`${type}/${id}`}>
                {id}
              </NavLink>
            ))}
          </div>
          <div className={Styles.features}>
            <h3>features</h3>
            {relatedFeatures.map(({ type, id }) => (
              <NavLink key={`${type}:${id}`} to={`${type}/${id}`}>
                {id}
              </NavLink>
            ))}
          </div>
          <div className={Styles.snippets}>
            <h3>snippets</h3>
            {relatedSnippets.map(({ type, id }) => (
              <NavLink key={`${type}:${id}`} to={`${type}/${id}`}>
                {id}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feature;

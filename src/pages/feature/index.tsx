import React, { useState, useEffect } from 'react';
import { useLocation, useParams, NavLink } from 'react-router-dom';

import type FeatureType from '../../types/core/feature';
import type { RELATED } from '../../types/common';
import api from '../../api';
import { CodeBlock, solarizedLight, solarizedDark } from 'react-code-blocks';

import { useTheme } from '../../components/theme-provider';

import Styles from './index.module.css';

type ReadmeItem = FeatureType['readme'][number] & { theme: any };

const README_RENDER_FUNCTION = {
  heading: ({ content }: ReadmeItem) => (
    <p className={Styles.heading}>{`${decodeURIComponent(content)}`}</p>
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

//todo: сделать related секцию
const Feature = () => {
  const [feature, setFeatures] = useState<FeatureType>();
  const { id } = useParams();
  const { theme } = useTheme();
  const codeTheme = theme === 'dark' ? solarizedDark : solarizedLight;
  const { state }: LOCATION_STATE = useLocation();

  useEffect(() => {
    const fetchFeature = async (id: number) => {
      const data = await api.get.feature(id);
      console.log('related state', state);

      setFeatures(data);
    };
    console.log('process.env.PUBLIC_URL', process.env.PUBLIC_URL);

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
      {feature && (
        <div className={Styles.feature}>
          <div className={Styles.readme}>
            {feature.readme.map((item, index) => (
              <div key={index}>
                {README_RENDER_FUNCTION[item.type]({
                  ...item,
                  theme: codeTheme,
                })}
              </div>
            ))}
          </div>
          <br />
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
      )}
    </div>
  );
};

export default Feature;

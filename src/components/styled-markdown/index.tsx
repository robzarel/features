import React from 'react';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneLight,
  oneDark,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useTheme } from '../../components/theme-provider';

import Styles from './index.module.css';

const StyledMarkDown = ({ md }: { md: string }) => {
  const { theme } = useTheme();
  const codeTheme = theme === 'dark' ? oneDark : oneLight;

  return (
    <ReactMarkdown
      components={{
        h1({ children }) {
          return <h1 className={Styles.heading}>{children}</h1>;
        },
        h2({ children }) {
          return <h2 className={Styles.heading}>{children}</h2>;
        },
        h3({ children }) {
          return <h3 className={Styles.heading}>{children}</h3>;
        },
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              style={codeTheme}
              language={match[1]}
              PreTag='div'
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {md}
    </ReactMarkdown>
  );
};

export default StyledMarkDown;

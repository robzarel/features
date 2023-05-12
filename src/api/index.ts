/* eslint-disable @typescript-eslint/no-unused-vars */
import getEndpoints from '../server/db';

import type { CV, RELATED, FEATURE_FLAGS } from '../types/common';

const endpoints = getEndpoints();
type ENDPOINTS = keyof typeof endpoints;

const get = async <T>(endpoint: ENDPOINTS): Promise<T> => {
  const path =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3001/api/${endpoint}`
      : `https://raw.githubusercontent.com/robzarel/features/gh-pages/static/db/${endpoint}.json`;

  const response = await fetch(path);
  return await response.json();
};

type COMMON = {
  type: 'project' | 'feature' | 'snippet';
  id: number;
  name: string;
  description: string;
  related: RELATED;
  hasReadme: boolean;
};

type API = {
  get: {
    featureFlags: () => Promise<FEATURE_FLAGS>;
    cv: () => Promise<CV>;
    common: () => Promise<COMMON[]>;
    readme: (
      type: 'project' | 'feature' | 'snippet',
      id: number
    ) => Promise<string>;
  };
};

const api: API = {
  get: {
    featureFlags: () => get<FEATURE_FLAGS>('featureFlags'),
    cv: () => get<CV>('cv'),
    common: () => get<COMMON[]>('common'),
    readme: async (type, id) => {
      const path =
        process.env.NODE_ENV === 'development'
          ? `http://localhost:3001/${type}/${id}.md`
          : `https://raw.githubusercontent.com/robzarel/features/gh-pages/static/db/readme/${type}/${id}.md`;

      const res = await fetch(path);
      return await res.text();
    },
  },
};

export type { COMMON };
export default api;

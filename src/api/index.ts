import type { CV, RELATED } from '../types/common';

// todo: fix import '../server/db' error
type ENDPOINTS = 'cv' | 'common' | 'projects' | 'features' | 'snippets';

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

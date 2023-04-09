import type { CV, RELATED } from '../types/common';
import type SNIPPET from '../types/core/snippet';
import type PROJECT from '../types/core/project';
import type FEAUTRE from '../types/core/feature';

type ENDPOINTS = 'cv' | 'common' | 'projects' | 'features' | 'snippets' | 'one';

const get = async <T>(endpoint: ENDPOINTS): Promise<T> => {
  const path =
    process.env.NODE_ENV === 'development'
      ? `http://localhost:3001/api/${endpoint}`
      : `https://raw.githubusercontent.com/robzarel/features/gh-pages/static/db/${endpoint}.json`;

  const response = await fetch(path);
  return await response.json();
};

const getById = async <T extends { id: number }>(
  endpoint: ENDPOINTS,
  id: number
) => {
  const parsed = await get<T[]>(endpoint);
  return parsed.find((item) => item.id === id);
};

type COMMON = {
  type: 'project' | 'feature' | 'snippet';
  id: number;
  name: string;
  description: string;
  related: RELATED;
};

type API = {
  get: {
    cv: () => Promise<CV>;
    common: () => Promise<COMMON[]>;
    readme: (
      type: 'project' | 'feature' | 'snippet',
      id: number
    ) => Promise<string>;
    snippet: (id: number) => Promise<SNIPPET | undefined>;
    project: (id: number) => Promise<PROJECT | undefined>;
    feature: (id: number) => Promise<FEAUTRE | undefined>;
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
    snippet: (id) => getById<SNIPPET>('snippets', id),
    project: (id) => getById<PROJECT>('projects', id),
    feature: (id) => getById<FEAUTRE>('features', id),
  },
};

export type { COMMON };
export default api;

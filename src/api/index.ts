type ENDPOINTS = 'cv' | 'common' | 'projects' | 'features' | 'snippets';

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

import type { CV, RELATED } from '../types/common';
import type SNIPPET from '../types/core/snippet';
import type PROJECT from '../types/core/project';
import type FEAUTRE from '../types/core/feature';
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
    snippet: (id: number) => Promise<SNIPPET | undefined>;
    project: (id: number) => Promise<PROJECT | undefined>;
    feature: (id: number) => Promise<FEAUTRE | undefined>;
  };
};

const api: API = {
  get: {
    cv: () => get<CV>('cv'),
    common: () => get<COMMON[]>('common'),
    snippet: (id) => getById<SNIPPET>('snippets', id),
    project: (id) => getById<PROJECT>('projects', id),
    feature: (id) => getById<FEAUTRE>('features', id),
  },
};
export type { COMMON };
export default api;

import projects from './core/projects.json';
import features from './core/features.json';
import snippets from './core/snippets.json';

import experience from './common/experience.json';
import skills from './common/skills.json';
import education from './common/education.json';
import featureFlags from './common/feature-flags.json';

type Params = { data: any; type: any };
type Result = {
  type: string;
  id: string;
  name: string;
  description: string;
  related: {
    type: 'project' | 'feature' | 'snippet';
    id: number;
  }[];
  hasReadme: boolean;
};

const extractData = (params: Params): Result[] => {
  const { data, type } = params;

  const result: Result[] = data.map((item: any) => ({
    type: type,
    id: item.id,
    name: item.name,
    description: item.description,
    related: item.related ? item.related : [],
    hasReadme: item.hasReadme ? item.hasReadme : false,
  }));

  return result;
};

const common = [
  { type: 'project', data: projects },
  { type: 'feature', data: features },
  { type: 'snippet', data: snippets },
].reduce((acc: Result[], current) => [...acc, ...extractData(current)], []);

const getEndpoints = () => ({
  common: common,
  cv: {
    experience: experience,
    skills: skills,
    education: education,
  },
  projects: projects,
  features: features,
  snippets: snippets,
  featureFlags: featureFlags,
});

export default getEndpoints;

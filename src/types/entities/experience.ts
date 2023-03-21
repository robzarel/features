import type Project from './project';
import type Feature from '../core/feature';

type Experience = {
  id: number;
  kind: 'development' | 'management';
  role: string;
  place: string;
  abstract: string;
  achievements: string[];
  description: string;
  started: string;
  ended: string;
  projects: Pick<Project, 'id' | 'name'>[];
  features: Pick<Feature, 'id' | 'name'>[];
};

export default Experience;

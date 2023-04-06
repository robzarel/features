import type { RELATED } from '../common';

type Experience = {
  id: number;
  kind: 'development' | 'management';
  role: string;
  city: string;
  country: string;
  company: string;
  abstract: string;
  achievements: string[];
  description: string;
  started: string;
  ended?: string;
  related?: RELATED[];
};

export default Experience;

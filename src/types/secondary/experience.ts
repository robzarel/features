import type { RELATED } from '../common';

type Description = {
  role: string;
  achievements: string[];
  company: string;
  city: string;
  country: string;
};

type Experience = {
  id: number;
  kind: 'development' | 'management';
  started: string;
  ended?: string;
  related?: RELATED[];
  description: {
    ru: Description;
    en: Description;
  };
};

export default Experience;

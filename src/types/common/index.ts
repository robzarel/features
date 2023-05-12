import EXPERIENCE from '../secondary/experience';
import SKILL from '../secondary/skill';
import EDUCATION from '../secondary/education';

type CV = {
  experience: EXPERIENCE[];
  skills: SKILL[];
  education: EDUCATION[];
};

type RELATED = {
  type: 'project' | 'feature' | 'snippet';
  id: number;
};

type FEATURE_FLAGS = { [key: string]: boolean };

type COMMON = {
  type: 'project' | 'feature' | 'snippet';
  id: number;
  name: string;
  description: string;
  related: RELATED;
  hasReadme: boolean;
};

export type { RELATED, CV, FEATURE_FLAGS, COMMON };

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

type FEATURE_FLAG = { [key: string]: boolean };

export type { RELATED, CV, FEATURE_FLAG };

import EXPERIENCE from '../secondary/experience';
import SKILL from '../secondary/skill';
import EDUCATION from '../secondary/education';

type CV = {
  experience: EXPERIENCE[];
  skills: SKILL[];
  education: EDUCATION[];
};

type RELATED = {
  type: 'project' | 'feature' | 'solution' | 'snippet';
  id: number;
  name: string;
  description: string;
};

export type { RELATED, CV };

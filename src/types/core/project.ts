import type SKILL from '../secondary/skill';
import type ROLE from '../secondary/role';
import type { RELATED } from '../common';

type PROJECT = {
  id: number;
  name: string;
  description: string;

  started: Date;
  ended?: Date;
  goal: string;
  role: ROLE;
  team: ROLE[];
  stack: Pick<SKILL, 'id' | 'kind' | 'name' | 'category'>[];
  features: string[];
  related: RELATED[];
};

export default PROJECT;

import type SKILL from "../core/skill";
import type ROLE from "../core/role";

type PROJECT = {
  id: number;
  name: string;
  description: string;
  started: Date;
  ended?: Date;
  goal: string;
  role: ROLE;
  team: ROLE[];
  stack: SKILL[];
  features: string[];
};

export default PROJECT;

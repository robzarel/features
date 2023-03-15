import type SKILL from "./skill";
import type ROLE from "./role";

type PROJECT = {
  name: string;
  started: Date;
  ended?: Date;
  goal: string;
  role: ROLE;
  team: ROLE[];
  stack: SKILL[];
  features: string[];
};

export default PROJECT;
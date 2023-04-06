import type CONTACTS from '../secondary/contacts';
import type SKILL from '../secondary/skill';
import type PROJECT from '../core/project';
import type LANGUAGE from '../secondary/language';
import type EDUCATION from '../secondary/education';
import type ACHIEVEMENT from '../secondary/achievement';

export type PROFILE = {
  id: number;
  intro: string;
  skills: SKILL[];
  acievements: ACHIEVEMENT[];
  projects: PROJECT[];
  contacts: CONTACTS;
  languages: LANGUAGE[];
  education: EDUCATION[];
};

import type CONTACTS from '../core/contacts';
import type SKILL from '../core/skill';
import type PROJECT from '../core/project';
import type LANGUAGE from '../core/language';
import type EDUCATION from '../core/education';
import type ACHIEVEMENT from '../core/achievement';

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

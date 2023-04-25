/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const projects = require('./core/projects.json');
const features = require('./core/features.json');
const snippets = require('./core/snippets.json');

const experience = require('./common/experience.json');
const skills = require('./common/skills.json');
const education = require('./common/education.json');

const extractData = ({ data, type }) =>
  data.map((item) => ({
    type: type,
    id: item.id,
    name: item.name,
    description: item.description,
    related: item.related ? item.related : [],
    hasReadme: item.hasReadme ? item.hasReadme : false,
  }));
const arr = [
  { type: 'project', data: projects },
  { type: 'feature', data: features },
  { type: 'snippet', data: snippets },
];

module.exports = () => ({
  cv: {
    experience: experience,
    skills: skills,
    education: education,
  },
  common: arr.reduce((acc, current) => [...acc, ...extractData(current)], []),
  projects: projects,
  features: features,
  snippets: snippets,
});

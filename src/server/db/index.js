/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const projects = require('./projects.json');
const features = require('./features.json');
const snippets = require('./snippets.json');

const experience = require('./ru/experience.json');
const skills = require('./skills.json');
const education = require('./ru/education.json');

const extractData = ({ data, type }) =>
  data.map((item) => ({
    type: type,
    id: item.id,
    name: item.name,
    description: item.description,
    related: item.related ? item.related : [],
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

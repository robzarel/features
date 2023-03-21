/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const experience = require("./experience.json");
const projects = require("./projects.json");
const features = require("./features.json");
const solutions = require("./solutions.json");
const snippets = require("./snippets.json");

module.exports = () => ({
  experience: experience,
  projects: projects,
  features: features,
  solutions: solutions,
  snippets: snippets,
});

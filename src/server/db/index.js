/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const features = require('./features.json');
const categories = require('./categories.json');
const snippets = require('./snippets.json');

module.exports = () => ({
  features: features,
  categories: categories,
  snippets: snippets
});
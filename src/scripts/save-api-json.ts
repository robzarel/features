import fs from 'fs';
import getEndpoints from '../server/db';
const endpoints = getEndpoints();

fs.mkdir('./build/static/db', () => {
  for (const [key, value] of Object.entries(endpoints)) {
    fs.writeFile(
      `./build/static/db/${key}.json`,
      JSON.stringify(value),
      (err) => {
        if (err) throw err;
      }
    );
  }
});

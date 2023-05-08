import jsonServer from 'json-server';
import getEndpoints from '../server/db';

const endpoints = getEndpoints();

const middlewares = jsonServer.defaults({
  static: './src/server/db/readme',
});
const apiPrefix = jsonServer.rewriter({
  '/api/*': '/$1',
});

const server = jsonServer.create();
const router = jsonServer.router(endpoints);

server.use(middlewares);
server.use(apiPrefix);
server.use(router);

server.listen(3001, () => {
  console.log('JSON Server is running at port:', 3001);
});

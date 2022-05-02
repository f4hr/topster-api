import fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fastifyRateLimit from '@fastify/rate-limit';

import addRoutes from './routes';

const MAX_REQUESTS = process.env.API_MAX_REQUESTS ? parseInt(process.env.API_MAX_REQUESTS, 10) : 30;
const TIME_WINDOW = process.env.API_TIME_WINDOW || 60000;

const setUpCors = (app: FastifyInstance) => {
  app.register(fastifyCors);
};

const setUpSensible = (app: FastifyInstance) => {
  app.register(fastifySensible);
};

const setUpLimit = (app: FastifyInstance) => {
  app.register(fastifyRateLimit, {
    global: true,
    max: MAX_REQUESTS,
    timeWindow: TIME_WINDOW,
  });
};

export default async () => {
  const app = fastify({ logger: { prettyPrint: true } });

  setUpCors(app);
  setUpSensible(app);
  setUpLimit(app);
  addRoutes(app);

  return app;
};

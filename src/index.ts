import fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import fastifyOauth2 from '@fastify/oauth2';
import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fastifyRateLimit from '@fastify/rate-limit';

import addRoutes from './routes';

const MAX_REQUESTS = process.env.API_MAX_REQUESTS ? parseInt(process.env.API_MAX_REQUESTS, 10) : 30;
const TIME_WINDOW = process.env.API_TIME_WINDOW || 60000;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const SPOTIFY_CALLBACK_URL = process.env.SPOTIFY_CALLBACK_URL || '';

const validStates = new Set();

const setUpOauth2 = (app: FastifyInstance) => {
  app.register(fastifyOauth2, {
    name: 'spotifyOAuth2',
    scope: ['user-top-read'],
    credentials: {
      client: {
        id: SPOTIFY_CLIENT_ID,
        secret: SPOTIFY_CLIENT_SECRET,
      },
      auth: fastifyOauth2.SPOTIFY_CONFIGURATION,
    },
    startRedirectPath: '/login/spotify',
    callbackUri: SPOTIFY_CALLBACK_URL,
    generateStateFunction: (request: FastifyRequest<{ Querystring: { state: string } }>) => {
      const { state } = request.query;
      validStates.add(state);
      return state;
    },
    checkStateFunction: (returnedState: string, cb: (param?: Error) => void) => {
      if (validStates.has(returnedState)) {
        cb();
        return;
      }
      cb(new Error('Invalid state'));
    },
  });
};

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

  setUpOauth2(app);
  setUpCors(app);
  setUpSensible(app);
  setUpLimit(app);
  addRoutes(app);

  return app;
};

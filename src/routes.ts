import { FastifyInstance } from 'fastify';

import addLastfmRoutes from './services/lastfm/routes';

export default (app: FastifyInstance) => {
  addLastfmRoutes(app);
};

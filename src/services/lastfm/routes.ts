import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import type { PeriodType } from './utils';
import userInfoHandler from './routes/userInfo';
import userTopAlbumsHandler from './routes/userTopAlbums';
import userTopArtistsHandler from './routes/userTopArtists';

export type QuerystringType = {
  [key: string]: any;
  user: string;
  period?: PeriodType;
  limit?: number;
  page?: number;
};

const handler =
  <R>(routeHandler: (params: QuerystringType) => Promise<{ errors: string[]; data: R }>) =>
  async (
    request: FastifyRequest<{ Querystring: QuerystringType }>,
    reply: FastifyReply
  ): Promise<R | void> => {
    try {
      const { errors, data } = await routeHandler(request.query);

      if (errors.length) {
        // TODO: return all errors
        reply.badRequest(errors[0]);
        return;
      }
      reply.header('Content-Type', 'application/json; charset=utf-8').send({
        ...data,
        status: 'ok',
      });
    } catch (error: any) {
      reply.internalServerError(error.message);
    }
  };

export default (app: FastifyInstance) => {
  // TODO: provide type for handler
  app.get<{ Querystring: QuerystringType }>('/api/v1/lastfm/user-info', handler(userInfoHandler));

  app.get<{ Querystring: QuerystringType }>(
    '/api/v1/lastfm/top-albums',
    handler(userTopAlbumsHandler)
  );

  app.get<{ Querystring: QuerystringType }>(
    '/api/v1/lastfm/top-artists',
    handler(userTopArtistsHandler)
  );

  app.get('/', (_req, reply) => {
    reply.notFound();
  });
};

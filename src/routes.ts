import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import type { ResponseError } from './types';

import addLastfmRoutes from './services/lastfm/routes';
import addSpotifyRoutes from './services/spotify/routes';

type ResponseType = {
  status: 'ok' | 'error';
  errors: ResponseError[];
  data: any;
};

type HandlerType = (query: any) => Promise<{ errors: ResponseError[]; data: any }>;

export type ResourceHandler = (
  handler: HandlerType
) => (
  request: FastifyRequest<{ Querystring: any }>,
  reply: FastifyReply
) => Promise<ResponseType | void>;

const resourceHandler =
  (handler: HandlerType) =>
  async (
    request: FastifyRequest<{ Querystring: any }>,
    reply: FastifyReply
  ): Promise<ResponseType | void> => {
    try {
      const { errors, data } = await handler(request.query);

      if (errors.length === 0) {
        reply.header('Content-Type', 'application/json; charset=utf-8');
        reply.send({
          ...data,
          status: 'ok',
        });
      }

      // TODO: return all errors
      const [firstError] = errors;

      switch (firstError.code) {
        case 401:
          reply.unauthorized(firstError.message);
          break;
        case 404:
          reply.notFound(firstError.message);
          break;
        default:
          reply.badRequest(firstError.message);
      }
    } catch (error: any) {
      reply.internalServerError(error.message);
    }
  };

export default (app: FastifyInstance) => {
  addLastfmRoutes(app, resourceHandler);
  addSpotifyRoutes(app, resourceHandler);

  app.get('/', (_req, reply) => {
    reply.notFound();
  });
};

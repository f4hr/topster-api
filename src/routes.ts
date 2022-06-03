import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import type { ResponseError } from './types';

import addLastfmRoutes from './services/lastfm/routes';

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

      if (errors.length) {
        // TODO: return all errors
        const [firstError] = errors;

        if (firstError.code === 401) reply.unauthorized(firstError.message);
        reply.badRequest(`${firstError.code}: ${firstError.message}`);
      }

      reply.header('Content-Type', 'application/json; charset=utf-8');
      reply.send({
        ...data,
        status: 'ok',
      });
    } catch (error: any) {
      reply.internalServerError(error.message);
    }
  };

export default (app: FastifyInstance) => {
  addLastfmRoutes(app, resourceHandler);

  app.get('/', (_req, reply) => {
    reply.notFound();
  });
};

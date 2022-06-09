import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import type { Service, ResponseError } from './types';

import lastfmService from './services/lastfm';
import spotifyService from './services/spotify';
import addSpotifyRoutes from './services/spotify/routes';

type ResponseType = {
  status: 'ok' | 'error';
  errors: ResponseError[];
  data: any;
};

type ResourceHandler = (
  resourceMethod: string
) => (
  request: FastifyRequest<{ Params?: any; Querystring?: any }>,
  reply: FastifyReply
) => Promise<ResponseType | void>;

const getServiceProvider = (serviceName: string): Service => {
  switch (serviceName) {
    case 'lastfm':
      return lastfmService;
    case 'spotify':
      return spotifyService;
    default:
      throw new Error(`Unknown service name '${serviceName}'`);
  }
};

const getServiceResourceHandler = (serviceName: string, resourceMethod: string) => {
  const serviceProvider = getServiceProvider(serviceName);

  if (!serviceProvider[resourceMethod]) {
    throw new Error(`Resource is not supported in '${serviceProvider.getServiceName()}' service`);
  }

  return serviceProvider[resourceMethod];
};

const resourceHandler: ResourceHandler =
  (resourceMethod: string) =>
  async (
    request: FastifyRequest<{ Params?: any; Querystring?: any }>,
    reply: FastifyReply
  ): Promise<ResponseType | void> => {
    const { params, query } = request;
    const { service } = params;

    try {
      const { errors, data } = await getServiceResourceHandler(service, resourceMethod)(query);

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
      reply.badRequest(error.message);
    }
  };

export default (app: FastifyInstance) => {
  app.get('/api/v1/user/:service', resourceHandler('getUser'));

  app.get('/api/v1/top-artists/:service', resourceHandler('getTopArtists'));

  app.get('/api/v1/top-albums/:service', resourceHandler('getTopAlbums'));

  addSpotifyRoutes(app);

  app.get('/', (_req, reply) => {
    reply.notFound();
  });
};

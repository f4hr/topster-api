import { FastifyInstance, FastifyRequest } from 'fastify';

export default (app: FastifyInstance) => {
  app.get('/api/v1/spotify/auth', async (req, reply) => {
    // TODO: fix TypeScript error
    // @ts-ignore:next-line
    const token = await app.spotifyOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

    reply.send({ access_token: token.access_token, refresh_token: token.refresh_token });
  });

  app.get(
    '/api/v1/spotify/refresh-token',
    async (req: FastifyRequest<{ Querystring: { refresh_token: string } }>, reply) => {
      const { refresh_token: refreshToken } = req.query;
      // BUG: token is not an instance of Oauth2Token
      // TODO: fix TypeScript error
      // @ts-ignore:next-line
      const { token } = await app.spotifyOAuth2.getNewAccessTokenUsingRefreshToken(refreshToken);

      reply.send({ access_token: token.access_token });
    }
  );
};

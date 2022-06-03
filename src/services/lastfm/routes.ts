import { FastifyInstance } from 'fastify';

import userInfoHandler from './routes/userInfo';
import userTopArtistsHandler from './routes/userTopArtists';
import userTopAlbumsHandler from './routes/userTopAlbums';

import type { ResourceHandler } from '../../routes';

export default (app: FastifyInstance, handler: ResourceHandler) => {
  app.get('/api/v1/lastfm/user-info', handler(userInfoHandler));

  app.get('/api/v1/lastfm/top-albums', handler(userTopAlbumsHandler));

  app.get('/api/v1/lastfm/top-artists', handler(userTopArtistsHandler));
};

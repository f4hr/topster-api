import userRouteHandler from './routes/userInfo';
import topArtistsRouteHandler from './routes/userTopArtists';
import topAlbumsRouteHandler from './routes/userTopAlbums';

import type { Service } from '../../types';

const getServiceName = () => 'lastfm';
const getUser = (query: any) => userRouteHandler(query);
const getTopArtists = (query: any) => topArtistsRouteHandler(query);
const getTopAlbums = (query: any) => topAlbumsRouteHandler(query);

const service: Service = {
  getServiceName,
  getUser,
  getTopArtists,
  getTopAlbums,
};

export default service;

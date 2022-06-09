import topArtistsRouteHandler from './routes/userTopArtists';

import type { Service } from '../../types';
import type { SpotifyTopItemsQuery } from './routes/userTopItems';

const getServiceName = () => 'spotify';
const getTopArtists = (query: SpotifyTopItemsQuery) => topArtistsRouteHandler(query);

const service: Service = {
  getServiceName,
  getTopArtists,
};

export default service;

import userTopItemsHandler from './userTopItems';

import type { Artist, TopArtists } from '../../../types';

type SpotifyArtist = Artist & {
  uri: string;
  type: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    total: number;
  };
  genres: string[];
  popularity: number;
};

type SpotifyTopArtistsResponse = {
  href: string;
  items: SpotifyArtist[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};

const transformResponse = (data: SpotifyTopArtistsResponse): TopArtists => {
  const { items } = data;

  const normalizedItems = items.map(({ id, name, popularity, images }) => ({
    id,
    name,
    playcount: popularity,
    images: images.map(({ url }) => ({ url })),
  }));

  return {
    items: normalizedItems,
  };
};

export default userTopItemsHandler<SpotifyTopArtistsResponse, TopArtists>(
  'artists',
  transformResponse
);

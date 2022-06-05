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
  images: {
    url: string;
    width: number;
    height: number;
  }[];
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

  const sortImages = (images: SpotifyArtist['images']) =>
    [...images].sort((a, b) => a.width - b.width);

  const normalizedItems = items.map(({ id, name, popularity, images }) => ({
    id,
    name,
    playcount: popularity,
    images: sortImages(images).map(({ url }) => ({ url })),
  }));

  return {
    items: normalizedItems,
  };
};

export default userTopItemsHandler<SpotifyTopArtistsResponse, TopArtists>(
  'artists',
  transformResponse
);

import userTopItemsHandler from './userTopItems';

import type { Track, TopTracks } from '../../../types';

type SpotifyTrack = Track & {
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

type SpotifyTopTracksResponse = {
  href: string;
  items: SpotifyTrack[];
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
};

const transformResponse = (data: SpotifyTopTracksResponse): TopTracks => {
  const { items } = data;

  const normalizedItems = items.map(({ id, name, album, popularity, images }) => ({
    id,
    name,
    album,
    playcount: popularity,
    images: images.map(({ url }) => ({ url })),
  }));

  return {
    items: normalizedItems,
  };
};

export default userTopItemsHandler<SpotifyTopTracksResponse, TopTracks>(
  'tracks',
  transformResponse
);

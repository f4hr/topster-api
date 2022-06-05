import { API_METHODS } from '../utils';
import userTopItemsHandler from './userTopItems';

import type { TopArtists } from '../../../types';

type LastfmArtist = {
  name: string;
  playcount: number;
  url: string;
  image: { '#text': string }[];
};

type LastfmTopArtistsResponse = {
  topartists: {
    artist: any[];
    '@attr': {
      total: number;
      page: number;
      totalPages: number;
      perPage: number;
    };
  };
};

const transformResponse = (data: LastfmTopArtistsResponse): TopArtists => {
  const {
    topartists: {
      artist: artists,
      '@attr': { total, page, totalPages, perPage },
    },
  } = data;

  const normalizedArtists = artists.map(({ name, playcount, url, image }: LastfmArtist) => ({
    id: url,
    name,
    playcount,
    url,
    images: image.map((img) => ({ url: img['#text'] })),
  }));

  return {
    attributes: {
      total,
      page,
      totalPages,
      perPage,
    },
    items: normalizedArtists,
  };
};

export default userTopItemsHandler<LastfmTopArtistsResponse, TopArtists>(
  API_METHODS.TOP_ARTISTS,
  transformResponse
);

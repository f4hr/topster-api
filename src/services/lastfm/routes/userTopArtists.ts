import { API_METHODS, API_PERIODS } from '../utils';
import userTopItemsHandler from './userTopItems';

import type { ResponseError, TopArtists } from '../../../types';
import type { LastfmTopItemsQuery } from './userTopItems';

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

const requiredFields = ['user'];

const validate = (query: LastfmTopItemsQuery) => {
  const { period } = query;
  const errors: ResponseError[] = [];

  const missingFields = requiredFields.filter((f) => !query[f]);

  if (missingFields.length) {
    errors.push({ message: `Missing required fields: "${missingFields.join(', ')}"` });
  }

  if (period && !API_PERIODS.includes(period)) {
    errors.push({
      message: `Invalid value "${period}" for period`,
    });
  }

  return errors;
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
  validate,
  transformResponse
);

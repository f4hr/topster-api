import { API_METHODS, API_PERIODS } from '../utils';
import userTopItemsHandler from './userTopItems';

import type { ResponseError, TopAlbums } from '../../../types';
import type { LastfmTopItemsQuery } from './userTopItems';

type LastfmAlbum = {
  mbid: string | null;
  name: string;
  artist: {
    name: string;
  };
  playcount: number;
  url: string;
  image: { '#text': string }[];
};

type LastfmTopAlbumsResponse = {
  topalbums: {
    album: any[];
    '@attr': {
      total: number;
      page: number;
      totalPages: number;
      perPage: number;
    };
  };
};

const requiredFields = ['user'];

export const validate = (query: LastfmTopItemsQuery) => {
  const { period } = query;
  const errors: ResponseError[] = [];

  const missingFields = requiredFields.filter((f) => !query[f]);

  if (missingFields.length) {
    errors.push({ message: `Missing required fields: "${missingFields.join(', ')}"` });
  }

  if (period && !API_PERIODS.includes(period)) {
    errors.push({ message: `Invalid value "${period}" for period param` });
  }

  return errors;
};

const transformResponse = (data: LastfmTopAlbumsResponse): TopAlbums => {
  const {
    topalbums: {
      album: albums,
      '@attr': { total, page, totalPages, perPage },
    },
  } = data;

  const normalizedAlbums = albums.map(({ name, playcount, url, image, artist }: LastfmAlbum) => ({
    id: url,
    name,
    artist: artist.name,
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
    items: normalizedAlbums,
  };
};

export default userTopItemsHandler<LastfmTopAlbumsResponse, TopAlbums>(
  API_METHODS.TOP_ALBUMS,
  validate,
  transformResponse
);

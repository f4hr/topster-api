import axios from 'axios';

import type { QuerystringType } from '../routes';
import { API_METHODS, API_PERIODS, buildApiUrl } from '../utils';

type RawAlbum = {
  name: string;
  playcount: number;
  url: string;
  image: { '#text': string }[];
};

type NormalizedAlbum = {
  name: string;
  playcount: number;
  url: string;
  images: { url: string }[];
};

type RawResponseType = {
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

type ResponseType = {
  items: NormalizedAlbum[];
  attributes: {
    total: number;
    page: number;
    totalPages: number;
    perPage: number;
  };
};

const requiredFields = ['user'];

const validate = (query: QuerystringType) => {
  const { period } = query;
  const errors: string[] = [];

  const missingFields = requiredFields.filter((f) => !query[f]);

  if (missingFields.length) {
    errors.push(`Missing required fields: "${missingFields.join(', ')}"`);
  }

  if (period && !API_PERIODS.includes(period)) {
    errors.push(
      `Invalid value "${period}" for period param. Available values are [${API_PERIODS.join(', ')}]`
    );
  }

  return errors;
};

const transformResponse = (data: RawResponseType): ResponseType => {
  const {
    topalbums: {
      album: albums,
      '@attr': { total, page, totalPages, perPage },
    },
  } = data;

  const normalizedAlbums = albums.map(({ name, playcount, url, image }: RawAlbum) => ({
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
    items: normalizedAlbums,
  };
};

export default async (query: QuerystringType) => {
  const response: { errors: string[]; data: any } = {
    errors: [],
    data: null,
  };
  const errors = validate(query);
  const { user, period = '6month', limit, page: currentPage } = query;

  if (errors.length) response.errors = errors;

  return axios
    .get<RawResponseType>(buildApiUrl({ method: API_METHODS.TOP_ALBUMS }), {
      params: { user, period, limit, page: currentPage },
    })
    .then(({ data }) => ({ ...response, data: transformResponse(data) }));
};

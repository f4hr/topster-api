import axios from 'axios';

import { API_METHODS, buildApiUrl } from '../utils';

import type { ResponseError } from '../../../types';

export type LastfmUserInfoQuery = {
  [key: string]: any;
  user: string;
};

type RawUserInfoResponse = {
  user: {
    id: string;
    name: string;
    realname: string;
    url: string;
    image: {
      size: string;
      '#text': string;
    }[];
    country: string;
    age: string;
    gender: string;
    subscriber: string;
    playcount: string;
    playlists: string;
    bootstrap: string;
    registered: {
      unixtime: number;
    };
  };
};

export type UserInfoResponse = {
  user: {
    id: string;
    name: string;
    realname: string;
    url: string;
    images: {
      size: string;
      url: string;
    }[];
    country: string;
    age: string;
    gender: string;
    subscriber: string;
    playcount: string;
    playlists: string;
    registered: number;
  };
};

const requiredFields = ['user'];

const validate = (query: LastfmUserInfoQuery) => {
  const errors: ResponseError[] = [];

  const missingFields = requiredFields.filter((f) => !query[f]);

  if (missingFields.length) {
    errors.push({ message: `Missing required fields: "${missingFields.join(', ')}"` });
  }

  return errors;
};

const transformResponse = (data: RawUserInfoResponse): UserInfoResponse => {
  const {
    user: {
      id,
      name,
      realname,
      url,
      image,
      country,
      age,
      gender,
      subscriber,
      playcount,
      playlists,
      registered: { unixtime },
    },
  } = data;

  const images = image.map((img) => ({ size: img.size, url: img['#text'] }));

  return {
    user: {
      id,
      name,
      realname,
      url,
      images,
      country,
      age,
      gender,
      subscriber,
      playcount,
      playlists,
      registered: unixtime,
    },
  };
};

export default async (query: LastfmUserInfoQuery) => {
  const response: { errors: ResponseError[]; data: any } = {
    errors: [],
    data: null,
  };
  const errors = validate(query);
  const { user } = query;

  if (errors.length) response.errors = errors;

  return axios
    .get<RawUserInfoResponse>(buildApiUrl({ method: API_METHODS.USER_INFO }), {
      params: { user },
    })
    .then(({ data }) => ({ ...response, data: transformResponse(data) }));
};

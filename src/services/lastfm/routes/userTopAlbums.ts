import { API_METHODS } from '../utils';
import userTopItemsHandler from './userTopItems';

import type { TopAlbums } from '../../../types';

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
  transformResponse
);

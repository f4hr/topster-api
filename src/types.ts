export type ResponseError = {
  message: string;
  code?: number;
};

type Response = {
  errors: ResponseError[];
  status: 'ok' | 'error';
};

export type Artist = {
  id: string;
  name: string;
  playcount: number;
  images: {
    url: string;
  }[];
};

export type Album = {
  id: string;
  name: string;
  artist: string;
  playcount: number;
  images: {
    url: string;
  }[];
};

export type Track = {
  id: string;
  name: string;
  album: string;
  playcount: number;
  images: {
    url: string;
  }[];
};

export type TopArtists = {
  attributes?: {
    total: number;
    page: number;
    totalPages: number;
    perPage: number;
  };
  items: Artist[];
};

export type TopAlbums = {
  attributes?: {
    total: number;
    page: number;
    totalPages: number;
    perPage: number;
  };
  items: Album[];
};

export type TopTracks = {
  items: Track[];
};

export type TopArtistsResponse = Response & {
  data: TopArtists;
};

export type TopAlbumsResponse = Response & {
  data: TopAlbums;
};

export type TopTracksResponse = Response & {
  data: TopTracks;
};

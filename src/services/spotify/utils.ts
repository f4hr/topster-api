const API_URL = process.env.SPOTIFY_API_URL;
const PREFIX = 'v1';

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';
export type TopItemsType = 'artists' | 'tracks';

export const TIME_RANGES: { [key: string]: TimeRange } = {
  SHORT: 'short_term',
  MEDIUM: 'medium_term',
  LONG: 'long_term',
};

const buildApiUrl = (resource: string, params: { [key: string]: string } = {}) => {
  const resourceUrl = [API_URL, PREFIX, resource].join('/');
  const url = new URL(resourceUrl);

  Object.keys(params).forEach((key) => {
    url.searchParams.set(key, params[key]);
  });

  return url.toString();
};

const routes = {
  topItems: (resource: TopItemsType) => buildApiUrl(`me/top/${resource}`),
};

export default routes;

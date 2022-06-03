const API_URL = process.env.LASTFM_API_URL;
const API_KEY = process.env.LASTFM_API_KEY;
const PREFIX = '2.0';

export type LastfmTopItemsType = 'user.getinfo' | 'user.gettopalbums' | 'user.gettopartists';
export type PeriodType = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';

export const API_METHODS: { [key: string]: LastfmTopItemsType } = {
  USER_INFO: 'user.getinfo',
  TOP_ALBUMS: 'user.gettopalbums',
  TOP_ARTISTS: 'user.gettopartists',
};

export const API_PERIODS: PeriodType[] = [
  'overall',
  '7day',
  '1month',
  '3month',
  '6month',
  '12month',
];

export const buildApiUrl = (params: { [key: string]: string }) => {
  const baseUrl = [API_URL, PREFIX].join('/');
  const url = new URL(baseUrl);

  url.searchParams.set('format', 'json');
  url.searchParams.set('api_key', API_KEY ?? '');

  Object.keys(params).forEach((key) => {
    url.searchParams.set(key, params[key]);
  });

  return url.toString();
};

export default {
  buildApiUrl,
};

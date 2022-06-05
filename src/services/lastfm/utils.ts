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

export const API_PERIODS: { [key: string]: PeriodType } = {
  ALL: 'overall',
  D7: '7day',
  M1: '1month',
  M3: '3month',
  M6: '6month',
  Y1: '12month',
};

type Params = {
  [key: string]: any;
  method: LastfmTopItemsType;
};

const buildApiUrl = (params: Params) => {
  const baseUrl = [API_URL, PREFIX].join('/');
  const url = new URL(baseUrl);

  url.searchParams.set('format', 'json');
  url.searchParams.set('api_key', API_KEY ?? '');

  Object.keys(params).forEach((key) => {
    url.searchParams.set(key, params[key]);
  });

  return url.toString();
};

const routes = {
  userInfo: () => buildApiUrl({ method: 'user.getinfo' }),
  topItems: (resource: LastfmTopItemsType) => buildApiUrl({ method: resource }),
};

export default routes;

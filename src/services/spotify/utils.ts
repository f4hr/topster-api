// const API_URL = process.env.SPOTIFY_API_URL;
// const PREFIX = '1';

// type ResourceType = 'artists' | 'tracks';

// export const API_METHODS = {
//   USER_INFO: 'user.getinfo',
//   TOP_ALBUMS: 'user.gettopalbums',
//   TOP_ARTISTS: 'user.gettopartists',
// };

// export const authUrl = () => {
//   const baseUrl = [AUTH_URL].join('/');
//   const url = new URL(baseUrl);

//   url.searchParams.set('format', 'json');
//   url.searchParams.set('api_key', API_KEY ?? '');

//   Object.keys(params).forEach((key) => {
//     url.searchParams.set(key, params[key]);
//   });

//   return url.toString();
// };

// export const buildApiUrl = (params: { [key: string]: string }) => {
//   const baseUrl = [API_URL, PREFIX].join('/');
//   const url = new URL(baseUrl);

//   url.searchParams.set('format', 'json');
//   url.searchParams.set('api_key', API_KEY ?? '');

//   Object.keys(params).forEach((key) => {
//     url.searchParams.set(key, params[key]);
//   });

//   return url.toString();
// };

// export default {
//   buildApiUrl,
// };

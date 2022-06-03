// export default async (query: QuerystringType) => {
//   const state = nanoid(64);
//   res.cookie(stateKey, state);

//   // your application requests authorization
//   var scope = 'user-read-private user-read-email';
//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: CLIENT_ID,
//       scope: scope,
//       redirect_uri: REDIRECT_URI,
//       state: state
//     }));

//   return axios
//     .get<RawResponseType>(buildApiUrl({ method: API_METHODS.USER_INFO }), {
//       params: { user },
//     })
//     .then(({ data }) => ({ ...response, data: transformResponse(data) }));
// };

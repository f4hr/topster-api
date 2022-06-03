// import axios from 'axios';

// import type { QuerystringType } from '../routes';
// import { API_METHODS, buildApiUrl } from '../utils';

// type RawResponseType = {
//   user: {
//     id: string;
//     name: string;
//     realname: string;
//     url: string;
//     image: {
//       size: string;
//       '#text': string;
//     }[];
//     country: string;
//     age: string;
//     gender: string;
//     subscriber: string;
//     playcount: string;
//     playlists: string;
//     bootstrap: string;
//     registered: {
//       unixtime: number;
//     };
//   };
// };

// type ResponseType = {
//   user: {
//     id: string;
//     name: string;
//     realname: string;
//     url: string;
//     images: {
//       size: string;
//       url: string;
//     }[];
//     country: string;
//     age: string;
//     gender: string;
//     subscriber: string;
//     playcount: string;
//     playlists: string;
//     registered: number;
//   };
// };

// const requiredFields = ['user'];

// const validate = (query: QuerystringType) => {
//   const errors: string[] = [];

//   const missingFields = requiredFields.filter((f) => !query[f]);

//   if (missingFields.length) {
//     errors.push(`Missing required fields: "${missingFields.join(', ')}"`);
//   }

//   return errors;
// };

// const transformResponse = (data: RawResponseType): ResponseType => {
//   const {
//     user: {
//       id,
//       name,
//       realname,
//       url,
//       image,
//       country,
//       age,
//       gender,
//       subscriber,
//       playcount,
//       playlists,
//       registered: { unixtime },
//     },
//   } = data;

//   const images = image.map((img) => ({ size: img.size, url: img['#text'] }));

//   return {
//     user: {
//       id,
//       name,
//       realname,
//       url,
//       images,
//       country,
//       age,
//       gender,
//       subscriber,
//       playcount,
//       playlists,
//       registered: unixtime,
//     },
//   };
// };

// export default async (query: QuerystringType) => {
//   const response: { errors: string[]; data: any } = {
//     errors: [],
//     data: null,
//   };
//   const errors = validate(query);
//   const { user } = query;

//   if (errors.length) response.errors = errors;

//   return axios
//     .get<RawResponseType>(buildApiUrl({ method: API_METHODS.USER_INFO }), {
//       params: { user },
//     })
//     .then(({ data }) => ({ ...response, data: transformResponse(data) }));
// };

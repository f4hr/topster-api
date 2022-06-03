import axios from 'axios';

import type { ResponseError } from '../../../types';

type TopItemsType = 'artists' | 'tracks';
type TimeRange = 'long_term' | 'medium_term' | 'short_term';

export type SpotifyTopItemsQuery = {
  [key: string]: any;
  accessToken: string;
  type?: TopItemsType;
  limit?: number;
  offset?: number;
  timeRange?: TimeRange;
};

const handler =
  <R, D>(resourceType: TopItemsType, transformResponse: (data: R) => D) =>
  async (query: SpotifyTopItemsQuery): Promise<{ errors: ResponseError[]; data: D }> => {
    const response: { errors: ResponseError[]; data: any } = {
      errors: [],
      data: null,
    };
    // const errors = validate(query);
    const {
      access_token: accessToken,
      time_range: timeRange = 'medium_term',
      limit = 20,
      offset = 0,
    } = query;
    // if (errors.length) response.errors = errors;
    const params = { time_range: timeRange, limit, offset };

    // TODO: replace URL with function
    return axios
      .get<R>(`https://api.spotify.com/v1/me/top/${resourceType}`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ContentType: 'application/json',
        },
      })
      .then((res) => ({ ...response, data: transformResponse(res.data) }))
      .catch((error) => {
        if (error.response) {
          response.errors = [
            {
              code: error.response.status,
              message: error.response.status === 401 ? 'Bad or expired token' : error.message,
            },
          ];
        }

        return { ...response };
      });
  };

export default handler;

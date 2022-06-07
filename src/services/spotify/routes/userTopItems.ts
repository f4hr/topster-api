import axios from 'axios';

import routes, { TIME_RANGES } from '../utils';

import type { ResponseError } from '../../../types';
import type { TopItemsType, TimeRange } from '../utils';

type SpotifyTopItemsQuery = {
  [key: string]: any;
  accessToken: string;
  type?: TopItemsType;
  limit?: number;
  offset?: number;
  timeRange?: TimeRange;
};

const REQUIRED_FIELDS: string[] = [];

const validateTopItems = (query: SpotifyTopItemsQuery) => {
  const { timeRange, limit } = query;
  const errors: ResponseError[] = [];

  const missingFields = REQUIRED_FIELDS.filter((f) => !query[f] || query[f] === '');

  if (missingFields.length) {
    errors.push({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  if (timeRange && !Object.values(TIME_RANGES).includes(timeRange)) {
    errors.push({ message: `Invalid value "${timeRange}" for time range` });
  }

  if (limit && (limit < 0 || limit > 50)) {
    errors.push({ message: 'Limit value out of range (0 < limit <= 50)' });
  }

  return errors;
};

const handler =
  <R, D>(
    resourceType: TopItemsType,
    transformResponse: (data: R) => D,
    validate?: (query: SpotifyTopItemsQuery) => ResponseError[]
  ) =>
  async (query: SpotifyTopItemsQuery): Promise<{ errors: ResponseError[]; data: D }> => {
    const response: { errors: ResponseError[]; data: any } = {
      errors: [],
      data: null,
    };

    // validate
    const errors = validateTopItems(query);
    if (validate) {
      errors.push(...validate(query));
    }
    if (errors.length) response.errors = errors;

    const {
      access_token: accessToken,
      time_range: timeRange = 'medium_term',
      limit = 20,
      offset = 0,
    } = query;

    const params = { time_range: timeRange, limit, offset };

    return axios
      .get<R>(routes.topItems(resourceType), {
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

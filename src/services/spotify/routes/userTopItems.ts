import axios from 'axios';

import routes, { TIME_RANGES } from '../utils';

import type { ResponseError } from '../../../types';
import type { TopItemsType, TimeRange } from '../utils';

type SpotifyTopItemsQuery = {
  [key: string]: string | number | undefined | TopItemsType | TimeRange;
  access_token: string;
  type?: TopItemsType;
  time_range?: TimeRange;
  limit?: number;
  offset?: number;
};

type SpotifyTopItemsNormalizedQuery = {
  [key: string]: string | number | TopItemsType | TimeRange;
  accessToken: string;
  type: TopItemsType;
  timeRange: TimeRange;
  limit: number;
  offset: number;
};

const DEFAULT_PARAMS = {
  TYPE: 'artists' as SpotifyTopItemsNormalizedQuery['type'],
  TIME_RANGE: 'medium_term' as SpotifyTopItemsNormalizedQuery['timeRange'],
  LIMIT: 20 as SpotifyTopItemsNormalizedQuery['limit'],
  OFFSET: 0 as SpotifyTopItemsNormalizedQuery['offset'],
};

const REQUIRED_FIELDS: string[] = ['accessToken'];
const validateTopItems = (query: SpotifyTopItemsNormalizedQuery) => {
  const { timeRange, limit, offset } = query;
  const errors: ResponseError[] = [];

  const missingFields = REQUIRED_FIELDS.filter((f) => !query[f] || query[f] === '');

  if (missingFields.length) {
    errors.push({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  if (!Object.values(TIME_RANGES).includes(timeRange)) {
    errors.push({ message: `Invalid value "${timeRange}" for time range` });
  }

  if (limit < 0 || limit > 50) {
    errors.push({ message: 'Limit value out of range (0 < limit <= 50)' });
  }

  if (offset < 0) {
    errors.push({ message: 'Offset value out of range (offset >= 0)' });
  }

  return errors;
};

const handler =
  <R, D>(
    resourceType: TopItemsType,
    transformResponse: (data: R) => D,
    validate?: (query: SpotifyTopItemsNormalizedQuery) => ResponseError[]
  ) =>
  async (query: SpotifyTopItemsQuery): Promise<{ errors: ResponseError[]; data: D }> => {
    const response: { errors: ResponseError[]; data: any } = {
      errors: [],
      data: null,
    };

    const normalizedQuery: SpotifyTopItemsNormalizedQuery = {
      accessToken: query.access_token ?? '',
      type: query.type ?? DEFAULT_PARAMS.TYPE,
      timeRange: query.time_range ?? DEFAULT_PARAMS.TIME_RANGE,
      limit: query.limit ?? DEFAULT_PARAMS.LIMIT,
      offset: query.offset ?? DEFAULT_PARAMS.OFFSET,
    };

    // validate
    const errors = validateTopItems(normalizedQuery);
    if (validate) {
      errors.push(...validate(normalizedQuery));
    }
    if (errors.length) {
      response.errors = errors;
      return response;
    }

    const params = {
      time_range: normalizedQuery.timeRange,
      limit: normalizedQuery.limit,
      offset: normalizedQuery.offset,
    };

    return axios
      .get<R>(routes.topItems(resourceType), {
        params,
        headers: {
          Authorization: `Bearer ${normalizedQuery.accessToken}`,
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

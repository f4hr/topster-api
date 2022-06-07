import axios from 'axios';

import routes, { API_PERIODS } from '../utils';

import type { ResponseError } from '../../../types';
import type { LastfmTopItemsType, PeriodType } from '../utils';

type LastfmTopItemsQuery = {
  [key: string]: undefined | string | number | PeriodType;
  user: string;
  period?: PeriodType;
  limit?: number;
  offset?: number;
  page?: number;
};

type LastfmTopItemsNormalizedQuery = {
  [key: string]: string | number | PeriodType;
  user: string;
  period: PeriodType;
  limit: number;
  offset: number;
  page: number;
};

const DEFAULT_PARAMS = {
  PERIOD: '6month' as LastfmTopItemsNormalizedQuery['period'],
  LIMIT: 50 as LastfmTopItemsNormalizedQuery['limit'],
  OFFSET: 0 as LastfmTopItemsNormalizedQuery['offset'],
  PAGE: 1 as LastfmTopItemsNormalizedQuery['page'],
};

const REQUIRED_FIELDS: string[] = ['user'];
const validateTopItems = (query: LastfmTopItemsNormalizedQuery) => {
  const { period, limit, page, offset } = query;
  const errors: ResponseError[] = [];

  const missingFields = REQUIRED_FIELDS.filter((f) => !query[f] || query[f] === '');

  if (missingFields.length) {
    errors.push({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  if (!Object.values(API_PERIODS).includes(period)) {
    errors.push({ message: `Invalid value '${period}' for period param` });
  }

  if (limit < 0 || limit > 100) {
    errors.push({ message: 'Limit value out of range (0 < limit <= 100)' });
  }

  if (offset < 0) {
    errors.push({ message: 'Offset value out of range (offset >= 0)' });
  }

  if (page < 1) {
    errors.push({ message: 'Page value out of range (page > 0)' });
  }

  return errors;
};

const handler =
  <R, D>(
    resourceType: LastfmTopItemsType,
    transformResponse: (data: R) => D,
    validate?: (query: LastfmTopItemsNormalizedQuery) => ResponseError[]
  ) =>
  async (query: LastfmTopItemsQuery): Promise<{ errors: ResponseError[]; data: D }> => {
    const response: { errors: ResponseError[]; data: any } = {
      errors: [],
      data: null,
    };

    const normalizedQuery: LastfmTopItemsNormalizedQuery = {
      user: query.user ?? '',
      period: query.period ?? DEFAULT_PARAMS.PERIOD,
      limit: query.limit ?? DEFAULT_PARAMS.LIMIT,
      offset: query.offset ?? DEFAULT_PARAMS.OFFSET,
      page: query.page ?? DEFAULT_PARAMS.PAGE,
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

    const { user, period, limit, offset, page } = normalizedQuery;

    const params: LastfmTopItemsNormalizedQuery = { user, period, limit, offset, page };

    return axios
      .get<R>(routes.topItems(resourceType), { params })
      .then(({ data }) => ({ ...response, data: transformResponse(data) }));
  };

export default handler;

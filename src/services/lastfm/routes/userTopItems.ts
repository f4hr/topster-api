import axios from 'axios';

import routes, { API_PERIODS } from '../utils';

import type { ResponseError } from '../../../types';
import type { LastfmTopItemsType, PeriodType } from '../utils';

type LastfmTopItemsQuery = {
  [key: string]: any;
  user: string;
  period?: PeriodType;
  limit?: number;
  offset?: number;
  page?: number;
};

const REQUIRED_FIELDS: string[] = ['user'];

const validateTopItems = (query: LastfmTopItemsQuery) => {
  const { period } = query;
  const errors: ResponseError[] = [];

  const missingFields = REQUIRED_FIELDS.filter((f) => !query[f] || query[f] === '');

  if (missingFields.length) {
    errors.push({ message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  if (period && !Object.values(API_PERIODS).includes(period)) {
    errors.push({ message: `Invalid value "${period}" for period param` });
  }

  return errors;
};

const handler =
  <R, D>(
    resourceType: LastfmTopItemsType,
    transformResponse: (data: R) => D,
    validate?: (query: LastfmTopItemsQuery) => ResponseError[]
  ) =>
  async (query: LastfmTopItemsQuery): Promise<{ errors: ResponseError[]; data: D }> => {
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

    const { user, period = '6month', limit, page: currentPage } = query;

    const params = { user, period, limit, page: currentPage };

    return axios
      .get<R>(routes.topItems(resourceType), { params })
      .then(({ data }) => ({ ...response, data: transformResponse(data) }));
  };

export default handler;

import axios from 'axios';

import { buildApiUrl } from '../utils';

import type { ResponseError } from '../../../types';
import type { LastfmTopItemsType, PeriodType } from '../utils';

export type LastfmTopItemsQuery = {
  [key: string]: any;
  user: string;
  period?: PeriodType;
  limit?: number;
  offset?: number;
  page?: number;
};

const handler =
  <R, D>(
    resourceType: LastfmTopItemsType,
    validate: (query: LastfmTopItemsQuery) => ResponseError[],
    transformResponse: (data: R) => D
  ) =>
  async (query: LastfmTopItemsQuery): Promise<{ errors: ResponseError[]; data: D }> => {
    const response: { errors: ResponseError[]; data: any } = {
      errors: [],
      data: null,
    };

    const errors = validate(query);

    const { user, period = '6month', limit, page: currentPage } = query;

    if (errors.length) response.errors = errors;

    const params = { user, period, limit, page: currentPage };

    return axios
      .get<R>(buildApiUrl({ method: resourceType }), { params })
      .then(({ data }) => ({ ...response, data: transformResponse(data) }));
  };

export default handler;

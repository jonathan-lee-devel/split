import {AnonymousController, HttpStatus} from '@split-common/split-http';

import {
  IndexHealthCheckRequestBody,
  IndexHealthCheckRequestHeaders,
  IndexHealthCheckRequestParams,
  IndexHealthCheckRequestQuery,
} from '../schemas';

export const makeIndexHealthCheckController = (
): AnonymousController<
  IndexHealthCheckRequestBody,
  IndexHealthCheckRequestParams,
  IndexHealthCheckRequestQuery,
  IndexHealthCheckRequestHeaders,
  never> =>
  async () => {
    return {status: HttpStatus.OK};
  };

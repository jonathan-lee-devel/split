import {AnonymousController, HttpStatus} from '@split-common/split-http';

import {IndexHealthCheckRequestBody, IndexHealthCheckRequestParams, IndexHealthCheckRequestQuery} from '../schemas';

export const makeIndexHealthCheckController = (
): AnonymousController<
  IndexHealthCheckRequestBody,
  IndexHealthCheckRequestParams,
  IndexHealthCheckRequestQuery,
  never> =>
  async () => {
    return {status: HttpStatus.OK};
  };

import {AnonymousEndpointUseCase, HttpStatus} from '@split-common/split-http';

import {IndexHealthCheckRequestBody, IndexHealthCheckRequestParams, IndexHealthCheckRequestQuery} from '../schemas';

export const makeIndexHealthCheckUseCase = (
): AnonymousEndpointUseCase<
  IndexHealthCheckRequestBody,
  IndexHealthCheckRequestParams,
  IndexHealthCheckRequestQuery,
  unknown
> =>
  async () => {
    return {status: HttpStatus.OK, data: undefined};
  };

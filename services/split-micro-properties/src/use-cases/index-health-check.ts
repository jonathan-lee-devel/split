import {AnonymousEndpointUseCase, HttpStatus} from '@split-common/split-http';
import {undefined} from 'zod';

import {IndexHealthCheckRequestBody, IndexHealthCheckRequestQuery} from '../schemas/index-health-check';

export const makeIndexHealthCheckUseCase = (
): AnonymousEndpointUseCase<IndexHealthCheckRequestBody, IndexHealthCheckRequestQuery, unknown> =>
  async () => {
    return {status: HttpStatus.OK, data: undefined};
  };

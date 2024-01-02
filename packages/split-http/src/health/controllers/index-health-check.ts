import {AnonymousController} from '../../endpoint-util';
import {HttpStatus} from '../../enums';
import {
  IndexHealthCheckRequestBody,
  IndexHealthCheckRequestHeaders,
  IndexHealthCheckRequestParams,
  IndexHealthCheckRequestQuery,
} from '../schemas/index-health-check';

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

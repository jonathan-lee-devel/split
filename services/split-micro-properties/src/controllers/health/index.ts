import {returnAnonymouslyBasedOnSafeParseResult} from '@split-common/split-http';

import {makeIndexHealthCheckCallback} from './callbacks/index-health-check';
import {makeMakeIndexHealthCheckEndpoint} from './endpoints/index-health-check';
import {IndexHealthCheckRequestBodySchema, IndexHealthCheckRequestQuerySchema} from './schemas/index-health-check';
import logger from '../../logger';

export const indexHealthCheckHandler = makeMakeIndexHealthCheckEndpoint(returnAnonymouslyBasedOnSafeParseResult)(
    IndexHealthCheckRequestBodySchema,
    IndexHealthCheckRequestQuerySchema,
    makeIndexHealthCheckCallback(logger),
);

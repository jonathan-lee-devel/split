import {makeGetPropertyById} from './property/get-property-by-id';
import {getPropertiesServiceBaseUrlFromNodeEnv} from './property/get-property-service-base-url';
import {environment} from '../environment';
import logger from '../logger';


export const getPropertyById = makeGetPropertyById(
    logger,
    getPropertiesServiceBaseUrlFromNodeEnv(environment.NODE_ENV),
);

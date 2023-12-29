import {makeGenerateId} from '@split-common/split-auth';
import {defaultModelTransform} from '@split-common/split-service-config';

import {makeCreatePropertyUseCase} from './create-property';
import {makeIndexHealthCheckUseCase} from './index-health-check';
import {PropertyEntity} from '../entities/PropertyEntity';
import logger from '../logger';
import {PropertyModel} from '../models';

export const indexHealthCheckUseCase = makeIndexHealthCheckUseCase();

export const createPropertyUseCase = makeCreatePropertyUseCase(
    logger,
    new PropertyEntity(PropertyModel, defaultModelTransform),
    makeGenerateId(logger),
);
